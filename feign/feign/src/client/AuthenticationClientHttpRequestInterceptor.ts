import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface,} from "./ClientHttpRequestInterceptor";
import {AuthenticationStrategy, AuthenticationToken, NEVER_REFRESH_FLAG} from "./AuthenticationStrategy";
import {getFeignClientMethodConfigurationByRequest,} from "../context/RequestContextHolder";
import {UNAUTHORIZED_RESPONSE} from '../constant/FeignConstVar';
import StringUtils from 'fengwuxp-common-utils/lib/string/StringUtils';
import {AuthenticationType} from "../constant/AuthenticationType";
import {RequestAuthenticationType} from "../annotations/mapping/Mapping";


/**
 *  Authentication client http request interceptor
 *
 *  Support blocking 'authorization' refresh
 */
export default class AuthenticationClientHttpRequestInterceptor<T extends HttpRequest>
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
    private readonly aheadOfTimes: number;

    private authenticationStrategy: AuthenticationStrategy;

    // blocking 'authorization' refresh
    private readonly blockingRefreshAuthorization: boolean;

    // default AuthenticationType
    private defaultAuthenticationType: RequestAuthenticationType;

    /**
     *
     * @param authenticationStrategy
     * @param aheadOfTimes                default: 5 * 60 * 1000
     * @param blockingRefreshAuthorization
     */
    constructor(authenticationStrategy: AuthenticationStrategy,
                aheadOfTimes?: number,
                blockingRefreshAuthorization: boolean = true) {
        this.aheadOfTimes = aheadOfTimes || 5 * 60 * 1000;
        this.blockingRefreshAuthorization = blockingRefreshAuthorization;
        this.setAuthenticationStrategy(authenticationStrategy);
    }

    interceptor = async (req: T) => {

        const requestMapping = getFeignClientMethodConfigurationByRequest(req)?.requestMapping;
        if (requestMapping == null) {
            // 不存在则不处理
            return req;
        }
        const authenticationType = this.getAuthenticationType(requestMapping.authenticationType, this.defaultAuthenticationType);
        if (authenticationType === AuthenticationType.NONE) {
            // none certification
            return req;
        }
        let isTryAuthentication = authenticationType == AuthenticationType.TRY;

        if (!this.needAppendAuthorizationHeader(req.headers)) {
            // Prevent recursion on refresh
            return req;
        }

        const {aheadOfTimes, blockingRefreshAuthorization, authenticationStrategy} = this;
        let authenticationToken: AuthenticationToken;
        try {
            authenticationToken = await authenticationStrategy.getAuthorization(req);
        } catch (e) {
            if (isTryAuthentication) {
                return req;
            }
            return Promise.reject({
                ...UNAUTHORIZED_RESPONSE,
                data: e
            });
        }
        if (authenticationToken == null || !StringUtils.hasText(authenticationToken.authorization)) {
            if (isTryAuthentication) {
                return req;
            }
            return Promise.reject('authorization is null [feign client mock return]');
        }
        const currentTimes = new Date().getTime();
        const tokenIsNever = authenticationToken.expireDate === NEVER_REFRESH_FLAG;
        const refreshTokenIsNever = authenticationToken.refreshExpireDate === NEVER_REFRESH_FLAG;
        const refreshTokenIsInvalid =
            authenticationToken.refreshExpireDate <= currentTimes + aheadOfTimes && !refreshTokenIsNever;

        if (refreshTokenIsInvalid && !tokenIsNever) {
            // 20 seconds in advance, the token is invalid and needs to be re-authenticated
            if (isTryAuthentication) {
                return req;
            }
            // refresh token invalid ,need authorization
            return Promise.reject(UNAUTHORIZED_RESPONSE);
        }

        const authorizationIsInvalid = authenticationToken.expireDate <= currentTimes + aheadOfTimes && !tokenIsNever;
        if (!authorizationIsInvalid) {
            req.headers = this.appendAuthorizationHeader(authenticationToken, req.headers);
            return req;
        }

        if (!blockingRefreshAuthorization) {
            // Concurrent refresh
            try {
                authenticationToken = await authenticationStrategy.refreshAuthorization(authenticationToken, req);
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
                    authenticationToken = await authenticationStrategy.refreshAuthorization(authenticationToken, req);
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
                        request.headers = this.appendAuthorizationHeader(authenticationToken, request.headers);
                        resolve(request);
                    }
                });
            }
        }

        req.headers = this.appendAuthorizationHeader(authenticationToken, req.headers);
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

    private getAuthenticationType = (input: RequestAuthenticationType, defaultType: RequestAuthenticationType = AuthenticationType.FORCE) => {
        return input == null ? defaultType : input;
    }

    public setAuthenticationStrategy = (authenticationStrategy: AuthenticationStrategy) => {
        this.authenticationStrategy = authenticationStrategy;
        // default force
        const defaultAuthenticationType = authenticationStrategy.getDefaultAuthenticationType?.();
        this.defaultAuthenticationType = this.getAuthenticationType(defaultAuthenticationType);
    }


}
