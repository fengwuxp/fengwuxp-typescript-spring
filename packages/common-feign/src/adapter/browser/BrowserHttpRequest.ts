import {HttpRequest} from "../../client/HttpRequest";


export interface BrowserHttpRequest extends HttpRequest{

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
