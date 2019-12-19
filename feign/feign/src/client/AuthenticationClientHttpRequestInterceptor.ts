import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface,} from "./ClientHttpRequestInterceptor";

export interface AuthenticationToken {

    authorization: string;

    expireDate: number;

}

/**
 * authentication strategy
 */
export interface AuthenticationStrategy<T extends AuthenticationToken = AuthenticationToken> {

    /**
     * get authorization header names
     * default :['Authorization']
     */
    getAuthorizationHeaderNames?: () => Array<string>;

    getAuthorization: (req: Readonly<HttpRequest>) => Promise<T> | T;

    refreshAuthorization: (authorization: T, req: Readonly<HttpRequest>) => Promise<T> | T;

    appendAuthorizationHeader: (authorization: T, headers: Record<string, string>) => Record<string, string>;

}

/**
 *  Authentication client http request interceptor
 *
 *  Support blocking 'authorization' refresh
 */
export default class AuthenticationClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    /// is refreshing status
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

    // In the loose mode, it only tries to obtain the authentication information. If it does not obtain it, it does nothing.
    private looseMode: boolean = true;

    constructor(authenticationStrategy: AuthenticationStrategy,
                aheadOfTimes?: number,
                looseMode: boolean = true,
                blockingRefreshAuthorization: boolean = true) {
        this.authenticationStrategy = authenticationStrategy;
        this.aheadOfTimes = aheadOfTimes || 5 * 60 * 1000;
        this.blockingRefreshAuthorization = blockingRefreshAuthorization;
        this.looseMode = looseMode
    }

    interceptor = async (req: T) => {

        if (!this.needAppendAuthorizationHeader(req.headers)) {
            // Prevent recursion on refresh
            return req;
        }

        const {aheadOfTimes, looseMode, blockingRefreshAuthorization, authenticationStrategy} = this;
        let authorization: AuthenticationToken;
        try {
            authorization = await authenticationStrategy.getAuthorization(req);
        } catch (e) {
            if (looseMode) {
                return req;
            }
            return Promise.reject(e);
        }
        if (authorization == null) {
            return Promise.reject('authorization is null');
        }

        const needRefreshAuthorization = authorization.expireDate < new Date().getTime() + aheadOfTimes;
        if (!needRefreshAuthorization) {
            req.headers = this.appendAuthorizationHeader(authorization, req.headers);
            return req;
        }

        if (!blockingRefreshAuthorization) {
            // Concurrent refresh
            try {
                authorization = await authenticationStrategy.refreshAuthorization(authorization, req);
            } catch (e) {
                if (looseMode) {
                    return req;
                }
                // refresh authorization error
                return Promise.reject(e);
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
                    error = e;
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
    }

}
