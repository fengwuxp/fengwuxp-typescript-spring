import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface,} from "./ClientHttpRequestInterceptor";
import {AuthenticationStrategy, AuthenticationToken, NEVER_REFRESH_FLAG} from "./AuthenticationStrategy";
import {getFeignClientMethodConfiguration,} from "../context/RequestContextHolder";
import {UNAUTHORIZED_RESPONSE} from '../constant/FeignConstVar';
import {AuthenticationType} from "../constant/AuthenticationType";
import {RequestAuthenticationType} from "../annotations/mapping/Mapping";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";


/**
 *  Authentication client http request interceptor
 *
 *  Support blocking 'authorization' refresh
 */
export default class AuthenticationClientHttpRequestInterceptor<T extends HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    private static DEFAULT_AUTHENTICATION_HEADER_NAMES = ["Authorization"];

    // is refreshing status
    protected static IS_REFRESH_TOKEN_ING = false;

    // protected static waitingQueue: Array<any> = [];
    protected static WAITING_QUEUE: Array<{
        resolve: (value?: any | PromiseLike<any>) => void;
        reject: (reason?: any) => void
    }> = [];

    // Refresh tokens 5 minutes in advance by default
    private readonly aheadOfTimes: number;

    private authenticationStrategy: AuthenticationStrategy;

    // Synchronous blocking 'authorization' refresh
    private readonly synchronousRefreshAuthorization: boolean;

    // default AuthenticationType
    private defaultAuthenticationType: RequestAuthenticationType;

    /**
     *
     * @param authenticationStrategy
     * @param aheadOfTimes                default: 5 * 60 * 1000
     * @param synchronousRefreshAuthorization
     */
    constructor(authenticationStrategy: AuthenticationStrategy,
                aheadOfTimes?: number,
                synchronousRefreshAuthorization: boolean = true) {
        this.aheadOfTimes = aheadOfTimes || 5 * 60 * 1000;
        this.synchronousRefreshAuthorization = synchronousRefreshAuthorization;
        this.setAuthenticationStrategy(authenticationStrategy);
    }

    interceptor = async (req: T) => {
        const authenticationType = this.getRequestAuthenticationType(req)
        if (!this.requestRequiresAuthorization(authenticationType) || this.hasAuthorizationHeader(req.headers)) {
            return req;
        }

        const isTryAuthentication = authenticationType == AuthenticationType.TRY;
        const {aheadOfTimes, authenticationStrategy} = this;
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

        const tokenNeverExpires = authenticationToken.expireDate === NEVER_REFRESH_FLAG;
        if (tokenNeverExpires) {
            return req;
        }

        const expireTimes = new Date().getTime() + aheadOfTimes;
        const tokenEffective = authenticationToken.expireDate > expireTimes;
        if (tokenEffective) {
            req.headers = this.appendAuthorizationHeader(authenticationToken, req.headers);
            return req;
        }

        // some time in advance {@code #aheadOfTimes}, the token is invalid and needs to be re-authenticated
        const refreshTokenEffective = (authenticationToken.refreshExpireDate ?? authenticationToken.expireDate) > expireTimes;
        if (refreshTokenEffective) {
            // refresh token
            authenticationToken = await this.refreshAuthenticationToken(req, authenticationToken);
            req.headers = this.appendAuthorizationHeader(authenticationToken, req.headers);
            return req;
        }

        if (isTryAuthentication) {
            return req;
        }

        // refresh token invalid ,need authorization
        return Promise.reject(UNAUTHORIZED_RESPONSE);
    };

    private getRequestAuthenticationType = (req: T): AuthenticationType => {
        const requestMapping = getFeignClientMethodConfiguration(req)?.requestMapping;
        if (requestMapping == null) {
            // 不存在则不处理
            return AuthenticationType.NONE;
        }
        return <AuthenticationType>this.getAuthenticationType(requestMapping.authenticationType, this.defaultAuthenticationType);
    }

    private requestRequiresAuthorization = (type: AuthenticationType): boolean => {
        return type == AuthenticationType.FORCE || type == AuthenticationType.TRY;
    }

    private refreshAuthenticationToken = async (req: T, refreshToken): Promise<AuthenticationToken> => {
        const {synchronousRefreshAuthorization} = this;
        if (synchronousRefreshAuthorization) {
            // Block other requests if you are refreshing token
            if (AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING) {
                // join wait queue
                return new Promise<AuthenticationToken>((resolve, reject) => {
                    AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE.push({
                        resolve,
                        reject,
                    });
                });
            } else {
                // Synchronous refresh
                AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING = true;
                // need refresh token
                let authenticationToken, error
                try {
                    authenticationToken = await this.refreshAuthenticationToken0(req, refreshToken);
                } catch (e) {
                    error = e;
                }
                AuthenticationClientHttpRequestInterceptor.IS_REFRESH_TOKEN_ING = false;
                const waitingQueue = [...AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE];
                // clear
                AuthenticationClientHttpRequestInterceptor.WAITING_QUEUE = [];
                waitingQueue.forEach(({reject, resolve}) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(authenticationToken);
                    }
                });
                return authenticationToken;
            }
        } else {
            // For asynchronous refresh, the server needs to support multiple tokens
            return this.refreshAuthenticationToken0(req, refreshToken);
        }
    }

    private refreshAuthenticationToken0 = async (req: T, refreshToken): Promise<AuthenticationToken> => {
        // Concurrent refresh
        try {
            return this.authenticationStrategy.refreshAuthorization(refreshToken, req);
        } catch (error) {
            // refresh authorization error
            return Promise.reject({
                ...UNAUTHORIZED_RESPONSE,
                data: error
            });
        }
    }

    /**
     * append authorization header
     * @param authorization
     * @param headers
     */
    private appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
        return this.authenticationStrategy.appendAuthorizationHeader(authorization, headers);
    };

    /**
     * exist authorization header
     * @param headers
     * @return true 已经存在请求头了，不需要在认证了
     */
    private hasAuthorizationHeader = (headers: Record<string, string>): boolean => {
        const headerNames = this.getAuthorizationHeaderNames();
        const existHeaderSize = headerNames.filter((headerName) => {
            return StringUtils.hasText(headers[headerName]);
        }).length;
        return existHeaderSize === headerNames.length;
    };

    private getAuthorizationHeaderNames() {
        const authorizationHeaderNamesFunc = this.authenticationStrategy.getAuthorizationHeaderNames;
        if (authorizationHeaderNamesFunc == null) {
            return AuthenticationClientHttpRequestInterceptor.DEFAULT_AUTHENTICATION_HEADER_NAMES;
        }
        return authorizationHeaderNamesFunc() ?? AuthenticationClientHttpRequestInterceptor.DEFAULT_AUTHENTICATION_HEADER_NAMES;
    }

    private getAuthenticationType = (input: RequestAuthenticationType, defaultType: RequestAuthenticationType = AuthenticationType.FORCE) => {
        return input ?? defaultType;
    }

    public setAuthenticationStrategy = (authenticationStrategy: AuthenticationStrategy) => {
        this.authenticationStrategy = authenticationStrategy;
        // default force
        const defaultAuthenticationType = authenticationStrategy.getDefaultAuthenticationType?.();
        this.defaultAuthenticationType = this.getAuthenticationType(defaultAuthenticationType);
    }


}
