import {HttpRequest} from "./HttpRequest";



/**
 * marked authentication strategy cache support
 *
 * {@see CacheAuthenticationStrategy}
 * {@see AuthenticationClientHttpRequestInterceptor}
 */
export interface CacheableAuthenticationStrategy {

    // enable cache support
    readonly enableCache?: boolean;
}

/**
 * authentication strategy
 */
export interface AuthenticationStrategy<T extends AuthenticationToken = AuthenticationToken> extends CacheableAuthenticationStrategy{

    /**
     * get authorization header names
     * default :['Authorization']
     */
    getAuthorizationHeaderNames?: () => Array<string>;

    getAuthorization: (req: Readonly<HttpRequest>) => Promise<T> | T;

    refreshAuthorization: (authorization: T, req: Readonly<HttpRequest>) => Promise<T> | T;

    appendAuthorizationHeader: (authorization: T, headers: Record<string, string>) => Record<string, string>;

}




// never refresh token flag
export const NEVER_REFRESH_FLAG = -1;

export interface AuthenticationToken {

    authorization: string;

    /**
     * token expire  time
     * {@see NEVER_REFRESH_TIME}
     */
    expireDate: number;

}
