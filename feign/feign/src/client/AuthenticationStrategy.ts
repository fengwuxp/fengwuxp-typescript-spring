import {HttpRequest} from "./HttpRequest";
import {AuthenticationType} from "../constant/AuthenticationType";


/**
 * marked authentication strategy cache support
 *
 * {@see CacheAuthenticationStrategy}
 * {@see AuthenticationClientHttpRequestInterceptor}
 */
export interface CacheCapableAuthenticationStrategy {

    /**
     * enable cache support
     * if value is 'true',use {@link CacheAuthenticationStrategy} wrapper
     */
    readonly enableCache: boolean;

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
export interface AuthenticationStrategy<T extends AuthenticationToken = AuthenticationToken> extends Partial<CacheCapableAuthenticationStrategy> {

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
    getDefaultAuthenticationType?: () => AuthenticationType;
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
 * use broadcast event handle authentication
 * {@see HttpStatus.UNAUTHORIZED}
 */
export interface AuthenticationBroadcaster {

    /**
     * send unauthorized event
     */
    sendUnAuthorizedEvent: () => void;

    /**
     * receive authorized success event
     * @param handle
     */
    receiveAuthorizedEvent: (handle: () => void) => void
}
