import { HttpRequest, HttpAdapter, ResolveHttpResponse, HttpResponse } from 'fengwuxp-typescript-feign';
import { CookieJar, AuthOptions, OAuthOptions } from 'request';

/**
 *  node js http request
 */
interface NodeHttpRequest extends HttpRequest {
    /**
     * cookie
     */
    jar?: CookieJar | boolean;
    auth?: AuthOptions;
    oauth?: OAuthOptions;
}

/**
 * node js adapter
 */
declare class NodeHttpAdapter implements HttpAdapter<NodeHttpRequest> {
    private timeout;
    private resolveHttpResponse;
    /**
     *
     * @param timeout  default 10000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>);
    send: (req: NodeHttpRequest) => Promise<HttpResponse>;
    private buildOption;
    /**
     * parse response data
     * @param response
     * @return {any}
     */
    private parse;
}

export { NodeHttpAdapter, NodeHttpRequest };
