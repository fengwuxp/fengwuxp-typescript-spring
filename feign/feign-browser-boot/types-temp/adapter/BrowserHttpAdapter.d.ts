import { HttpAdapter, HttpMediaType, HttpResponse, ResolveHttpResponse } from "fengwuxp-typescript-feign";
import { BrowserHttpRequest } from './BrowserHttpRequest';
/**
 *  browser http request adapter
 */
export default class BrowserHttpAdapter implements HttpAdapter<BrowserHttpRequest> {
    private timeout;
    private consumes;
    private resolveHttpResponse;
    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     * @param consumes  default 'application/json;charset=UTF-8'
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>, consumes?: HttpMediaType);
    send: (req: BrowserHttpRequest) => Promise<HttpResponse<any>>;
    /**
     * build http request
     * @param {HttpRequest} request
     * @return {Request}
     */
    private buildRequest;
    /**
     * parse response data
     * @param response
     * @return {any}
     */
    private parse;
    private parseJSON;
    private parseText;
    private paresArrayBuffer;
    private getHeaderByName;
    /**
     * http Transfer-Encoding
     * @param headers
     */
    private hasTransferEncoding;
}
