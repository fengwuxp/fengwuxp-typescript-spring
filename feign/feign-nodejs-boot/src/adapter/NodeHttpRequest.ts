
import {AuthOptions, CookieJar, OAuthOptions} from "request";
import {HttpRequest} from "fengwuxp-typescript-feign";

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
