import { HttpRequest, HttpAdapter, ResolveHttpResponse, HttpResponse } from 'fengwuxp-typescript-feign';

interface WeexHttpRequest extends HttpRequest {
    /**
     * 请求进度
     * @param data
     */
    requestProgress?: (data: {
        /**
         * 进度
         */
        progress: number;
        /**
         * 当前状态
         * state:’1’: 请求连接中
         * opened:’2’: 返回响应头中
         * received:’3’: 正在加载返回数据
         */
        readyState: number;
        /**
         * http 响应码
         */
        httpCode: number;
        /**
         * http 响应状态（响应码）描述
         */
        statusText?: string;
        /**
         * 响应头
         */
        headers: object;
    }) => void;
}

/**
 * 基于weex http adapter
 *
 * weex stream对象  {@doc https://weex.apache.org/cn/references/modules/stream.html}
 */
declare class WeexHttpAdapter implements HttpAdapter<WeexHttpRequest> {
    private timeout;
    private resolveHttpResponse;
    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>);
    send: (request: WeexHttpRequest) => Promise<HttpResponse>;
    private buildRequest;
}

export { WeexHttpAdapter, WeexHttpRequest };
