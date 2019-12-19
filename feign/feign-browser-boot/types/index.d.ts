import { HttpRequest, HttpAdapter, ResolveHttpResponse, HttpResponse, NetworkStatusListener, NetworkStatus } from 'fengwuxp-typescript-feign';

interface BrowserHttpRequest extends HttpRequest {
    /**
     * referrer
     */
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    /**
     * 请求的模式，主要用于跨域设置，cors, no-cors, same-origin
     */
    mode?: RequestMode;
    /**
     * 是否发送Cookie
     */
    credentials?: RequestCredentials;
    /**
     * 收到重定向请求之后的操作，follow, error, manual
     */
    redirect?: RequestRedirect;
    /**
     * 缓存模式
     */
    cache?: RequestCache;
    /**
     * 完整性校验
     */
    integrity?: string;
    /**
     * 长连接
     */
    keepalive?: boolean;
    window?: any;
}

/**
 *  browser http request adapter
 */
declare class BrowserHttpAdapter implements HttpAdapter<BrowserHttpRequest> {
    private timeout;
    private resolveHttpResponse;
    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>);
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
    private paresBlob;
    private getHeaderByName;
}

/**
 * browser network status listener
 */
declare class BrowserNetworkStatusListener implements NetworkStatusListener {
    getNetworkStatus: () => Promise<NetworkStatus>;
    onChange: (callback: (networkStatus: NetworkStatus) => void) => void;
    private processNetworkStats;
    private converterStateType;
    private getBrowserNetworkStatus;
}

export { BrowserHttpAdapter, BrowserHttpRequest, BrowserNetworkStatusListener };
