import {AuthenticationStrategy, AuthenticationToken} from "./AuthenticationStrategy";
import {HttpRequest} from './HttpRequest';


/**
 * cache AuthenticationStrategy
 * {@see CacheCapableAuthenticationStrategy#enableCache}
 */
export default class CacheAuthenticationStrategy implements AuthenticationStrategy {

    private authenticationStrategy: AuthenticationStrategy;

    private cacheAuthenticationToken: AuthenticationToken;

    constructor(authenticationStrategy: AuthenticationStrategy) {
        this.authenticationStrategy = authenticationStrategy;
    }

    appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>): Record<string, string> => {
        return this.authenticationStrategy.appendAuthorizationHeader(authorization, headers);
    };

    getAuthorization = async (req: Readonly<HttpRequest>) => {
        if (this.cacheAuthenticationToken == null) {
            this.cacheAuthenticationToken = await this.authenticationStrategy.getAuthorization(req);
        }
        return this.cacheAuthenticationToken;
    };

    getAuthorizationHeaderNames = () => {
        const authorizationHeaderNames = this.authenticationStrategy.getAuthorizationHeaderNames;
        if (authorizationHeaderNames != null) {
            return authorizationHeaderNames();
        }
        return ["Authorization"];
    };

    refreshAuthorization = async (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
        try {
            this.cacheAuthenticationToken = await this.authenticationStrategy.refreshAuthorization(authorization, req);
        } catch (e) {
            this.clearCache();
            return Promise.reject(e);
        }
        return this.cacheAuthenticationToken;
    }


    clearCache = () => {
        this.cacheAuthenticationToken = null;
    }


}
