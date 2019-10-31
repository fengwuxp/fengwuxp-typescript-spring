import {HttpRequest} from "../../../../../packages/feign/src/client/HttpRequest";
import {AuthOptions, CookieJar, OAuthOptions} from "request";

/**
 *  node js http request
 */
export interface NodeHttpRequest extends HttpRequest{

    /**
     * cookie
     */
    jar?: CookieJar | boolean;

    auth?: AuthOptions;

    oauth?: OAuthOptions;
}