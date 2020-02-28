import {HttpRequest} from "./HttpRequest";



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

export interface AuthenticationToken {

    authorization: string;

    expireDate: number;

}
