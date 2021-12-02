import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface,} from "./ClientHttpRequestInterceptor";
import {AuthenticationStrategy, AuthenticationToken, NEVER_REFRESH_FLAG} from "./AuthenticationStrategy";
import {getRequestFeignClientMethodConfiguration,} from "../context/RequestContextHolder";
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
    private refreshing = false;

    // wait refresh token request queue
    private waitRequestQueue: Array<{
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
        this.aheadOfTimes = aheadOfTimes ?? 5 * 60 * 1000;
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
        const requestMapping = getRequestFeignClientMethodConfiguration(req)?.requestMapping;
        if (requestMapping == null) {
            // 不存在则不处理
            return AuthenticationType.NONE;
        }
        return <AuthenticationType>this.getAuthenticationType(requestMapping.authenticationType, this.defaultAuthenticationType);
    }

    private requestRequiresAuthorization = (authenticationType: AuthenticationType): boolean => {
        return authenticationType == AuthenticationType.FORCE || authenticationType == AuthenticationType.TRY;
    }

    private refreshAuthenticationToken = async (req: T, refreshToken): Promise<AuthenticationToken> => {
        const {synchronousRefreshAuthorization} = this;
        if (synchronousRefreshAuthorization) {
            return this.syncRefreshAuthenticationToken(req, refreshToken);
        } else {
            // For asynchronous refresh, the server needs to support multiple tokens
            return this.refreshAuthenticationToken0(req, refreshToken);
        }
    }

    private syncRefreshAuthenticationToken = async (req: T, refreshToken): Promise<AuthenticationToken> => {
        // Block other requests if you are refreshing token
        if (this.refreshing) {
            // join wait queue
            return new Promise<AuthenticationToken>((resolve, reject) => {
                this.waitRequestQueue.push({
                    resolve,
                    reject,
                });
            });
        } else {
            // Synchronous refresh
            this.refreshing = true;
            // need refresh token
            let authenticationToken, error
            try {
                authenticationToken = await this.refreshAuthenticationToken0(req, refreshToken);
            } catch (e) {
                error = e;
            }
            this.completeWaitQueue(authenticationToken, error);
            this.refreshing = false;
            return authenticationToken;
        }
    }

    private completeWaitQueue(authenticationToken, error) {
        const waitRequestQueue = [...this.waitRequestQueue];
        // clear
        this.waitRequestQueue = [];
        waitRequestQueue.forEach(({reject, resolve}) => {
            if (authenticationToken != null) {
                resolve(authenticationToken);
            } else {
                reject(error);
            }
        });
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
