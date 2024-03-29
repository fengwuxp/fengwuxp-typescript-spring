import {HttpRequest} from "./HttpRequest";
import {MappingHeaders, RequestAuthenticationType} from "../annotations/mapping/Mapping";


/**
 * marked authentication strategy cache support
 *
 * {@see CacheAuthenticationStrategy}
 * {@see AuthenticationClientHttpRequestInterceptor}
 */
export interface CacheCapableAuthenticationStrategy {

    /**
     * clear cache
     * if send send unauthorized event,need clear cache
     * {@link AuthenticationBroadcaster#sendUnAuthorizedEvent}
     */
    clearCache: () => void;
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

    /**
     * get default AuthenticationType
     */
    getDefaultAuthenticationType?: () => RequestAuthenticationType;
}


// never refresh token flag
export const NEVER_REFRESH_FLAG = -1;

export interface AuthenticationToken {

    /**
     * authorization info
     */
    authorization: string;

    /**
     * token expire  time
     * {@see NEVER_REFRESH_TIME}
     */
    expireDate: number;

    /**
     * refresh token
     */
    refreshToken?: string;

    /**
     * refresh token expire time
     * {@see NEVER_REFRESH_TIME}
     */
    refreshExpireDate?: number;

}


/**
 * @param url 接口请求路径
 */
export type ApiPermissionProbeStrategyFunction = (url: string) => Promise<MappingHeaders>

/**
 * 用于判断接口请求路径是否需要权限
 */
export interface ApiPermissionProbeStrategyInterface {

    probe: ApiPermissionProbeStrategyFunction;
}


/**
 * api permission probe
 * {@see ApiPermissionProbeInterceptor}
 * {@see HeadMapping}
 */
export type ApiPermissionProbeStrategy = ApiPermissionProbeStrategyInterface | ApiPermissionProbeStrategyFunction;