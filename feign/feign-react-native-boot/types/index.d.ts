import { NetworkStatusListener, NetworkStatus, HttpRequest, HttpAdapter, ResolveHttpResponse, HttpResponse } from 'fengwuxp-typescript-feign';

/**
 * react-native nework status listener
 */
declare class ReactNativeNetworkStatusListener implements NetworkStatusListener {
    getNetworkStatus: () => Promise<NetworkStatus>;
    onChange: (callback: (networkStatus: NetworkStatus) => void) => void;
    private converterStateType;
}

interface ReactNativeHttpRequest extends HttpRequest {
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
 *  react-native http request adapter
 */
declare class ReactNativeHttpAdapter implements HttpAdapter<ReactNativeHttpRequest> {
    private timeout;
    private resolveHttpResponse;
    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>);
    send: (req: ReactNativeHttpRequest) => Promise<HttpResponse<any>>;
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
}

export { ReactNativeHttpAdapter, ReactNativeHttpRequest, ReactNativeNetworkStatusListener };
