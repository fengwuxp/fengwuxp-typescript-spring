import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface,} from "./ClientHttpRequestInterceptor";
import {AuthenticationStrategy, AuthenticationToken, NEVER_REFRESH_FLAG} from "./AuthenticationStrategy";
import CacheAuthenticationStrategy from "./CacheAuthenticationStrategy";
import {getFeignClientMethodConfigurationByRequest} from "../context/RequestContextHolder";
import {UNAUTHORIZED_RESPONSE} from '../constant/FeignConstVar';
import StringUtils from 'fengwuxp-common-utils/lib/string/StringUtils';


/**
 *  Authentication client http request interceptor
 *
 *  Support blocking 'authorization' refresh
 */
export default class AuthenticationClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    // is refreshing status
    protected static IS_REFRESH_TOKEN_ING = false;

    // protected static waitingQueue: Array<any> = [];
    protected static WAITING_QUEUE: Array<{
        resolve: (value?: any | PromiseLike<any>) => void;
        reject: (reason?: any) => void,
        request: HttpRequest
    }> = [];

    // Refresh tokens 5 minutes in advance by default
    private aheadOfTimes: number;

    private authenticationStrategy: AuthenticationStrategy;

    // blocking 'authorization' refresh
    private blockingRefreshAuthorization: boolean;


    /**
     *
     * @param authenticationStrategy
     * @param aheadOfTimes                default: 5 * 60 * 1000
     * @param blockingRefreshAuthorization
     */
    constructor(authenticationStrategy: AuthenticationStrategy,
                aheadOfTimes?: number,
                blockingRefreshAuthorization: boolean = true,) {
        if (authenticationStrategy.enableCache) {
            this.authenticationStrategy = new CacheAuthenticationStrategy(authenticationStrategy);
        } else {
            this.authenticationStrategy = authenticationStrategy;
        }
        this.aheadOfTimes = aheadOfTimes || 5 * 60 * 1000;
        this.blockingRefreshAuthorization = blockingRefreshAuthorization;
    }

    interceptor = async (req: T) => {

        const feignClientMethodConfigurationByRequest = getFeignClientMethodConfigurationByRequest(req);
        const mappingOptions = feignClientMethodConfigurationByRequest == null ? null : feignClientMethodConfigurationByRequest.requestMapping;
        if (mappingOptions != null) {
            if (mappingOptions.needCertification === false) {
                // none certification
                return req;
            }
        }

        if (!this.needAppendAuthorizationHeader(req.headers)) {
            // Prevent recursion on refresh
            return req;
        }

        const {aheadOfTimes, blockingRefreshAuthorization, authenticationStrategy} = this;
        let authorization: AuthenticationToken;
        try {
            authorization = await authenticationStrategy.getAuthorization(req);
        } catch (e) {
            return Promise.reject({
                ...UNAUTHORIZED_RESPONSE,
                data: e
            });
        }
        if (authorization == null || !StringUtils.hasText(authorization.authorization)) {
            return Promise.reject('authorization is null');
        }
        const currentTimes = new Date().getTime();
        if (authorization.expireDate <= currentTimes - 20 * 1000) {
            //20 seconds in advance, the token is invalid and needs to be re-authenticated
            return Promise.reject(UNAUTHORIZED_RESPONSE);
        }
        const authorizationIsInvalid = authorization.expireDate !== NEVER_REFRESH_FLAG && authorization.expireDate < currentTimes + aheadOfTimes;
        if (!authorizationIsInvalid) {
            req.headers = this.appendAuthorizationHeader(authorization, req.headers);
            return req;
        }

        if (!blockingRefreshAuthorization) {
            // Concurrent refresh
            try {
                authorization = await authenticationStrategy.refreshAuthorization(authorization, req);
            } catch (e) {
                // refresh authorization error
                return Promise.reject({
                    ...UNAUTHORIZED_RESPONSE,
                    data: e
                });
            }

        } else {
            if (AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING) {
                // join wait queue
                return new Promise<T>((resolve, reject) => {
                    AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE.push({
                        resolve,
                        reject,
                        request: req
                    });
                });
            } else {
                // Synchronous refresh
                AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING = true;
                // need refresh token
                let error;
                try {
                    authorization = await authenticationStrategy.refreshAuthorization(authorization, req);
                } catch (e) {
                    // refresh authorization error
                    return Promise.reject({
                        ...UNAUTHORIZED_RESPONSE,
                        data: e
                    });
                }
                const waitingQueue = [...AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE];
                // console.log("---等待刷新token的队列--->", waitingQueue.length);
                // clear
                AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE = [];
                AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING = false;
                waitingQueue.forEach(({reject, resolve, request}) => {
                    if (error) {
                        reject(error);
                    } else {
                        request.headers = this.appendAuthorizationHeader(authorization, request.headers);
                        resolve(request);
                    }
                });
            }
        }

        req.headers = this.appendAuthorizationHeader(authorization, req.headers);
        return req;

    };


    /**
     * append authorization header
     * @param authorization
     * @param headers
     */
    private appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {

        return this.authenticationStrategy.appendAuthorizationHeader(authorization, headers);
    };

    /**
     * need append authorization header
     * @param headers
     */
    private needAppendAuthorizationHeader = (headers: Record<string, string>) => {
        const authorizationHeaderNames = this.authenticationStrategy.getAuthorizationHeaderNames;
        const headerNames = authorizationHeaderNames ? authorizationHeaderNames() : ["Authorization"];
        const count = headerNames.map((headerName) => {
            return headers[headerName] != null ? 1 : 0;
        }).reduce((prev, current) => {
            return prev + current;
        }, 0);
        return count !== headerNames.length;
    };

    public setAuthenticationStrategy = (authenticationStrategy: AuthenticationStrategy<AuthenticationToken>) => {
        this.authenticationStrategy = authenticationStrategy;
    }
}
