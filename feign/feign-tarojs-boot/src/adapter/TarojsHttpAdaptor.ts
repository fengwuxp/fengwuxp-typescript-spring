import {CommonResolveHttpResponse, HttpAdapter, HttpResponse, ResolveHttpResponse} from "fengwuxp-typescript-feign";
import {TarojsHttpRequest} from "./TarojsHttpRequest";
import Taro, {request} from "@tarojs/taro";


/**
 * tarojs http adaptor
 */
export default class TarojsHttpAdaptor implements HttpAdapter<TarojsHttpRequest> {

    private timeout: number;

    private resolveHttpResponse: ResolveHttpResponse;

    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>) {
        this.timeout = timeout || 5 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
    }

    send = (req: TarojsHttpRequest): Promise<HttpResponse> => {
        const param = this.buildRequest(req);
        return Taro.request(param).then(this.resolveHttpResponse.resolve);
    };
    private buildRequest = (options: TarojsHttpRequest): request.Param<any> => {

        const {
            url,
            body,
            method,
            headers,
            credentials,
            mode,
            cache,
            dataType,
            responseType
        } = options;


        return {
            //请求方法get post
            method: method as any,
            //请求url
            url,
            //响应类型,,
            dataType,
            responseType,
            cache: (cache as any),
            credentials,
            mode: (mode as any),
            //headers HTTP 请求头
            header: headers,
            data: body,
        };

    };
}
