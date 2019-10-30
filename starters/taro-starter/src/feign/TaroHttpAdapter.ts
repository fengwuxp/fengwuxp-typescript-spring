import TaroJsHolder, {TaroInterfaceHolder} from "../TaroJsHolder";
import {CommonResolveHttpResponse, HttpAdapter, HttpResponse, ResolveHttpResponse} from "fengwuxp-typescript-feign";
import {TaroHttpRequest} from "./TaroHttpRequest";


/**
 * taro http request adapter
 */
export default class TaroHttpAdapter implements HttpAdapter<TaroHttpRequest> {

    protected taroHolder: TaroInterfaceHolder;

    private resolveHttpResponse: ResolveHttpResponse;

    private timeout: number;

    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>) {
        this.timeout = timeout || 5 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
        this.taroHolder = TaroJsHolder.getTaroHolder();
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
    }

    send = (request: TaroHttpRequest): Promise<HttpResponse> => {

        return this.taroHolder.taro.request(this.buildRequest(request)).then(this.resolveHttpResponse.resolve);
    };

    private buildRequest = (request: TaroHttpRequest): Taro.request.Param<any> => {

        const {
            url,
            body,
            method,
            headers,
            credentials,
            mode,
            cache,
            timeout
        } = request;


        return {
            // 请求方法
            method: method as any,
            timeout: timeout || this.timeout,
            // 请求url
            url,
            // 响应类型,
            dataType: "",
            cache: (cache as any),
            credentials,
            mode: (mode as any),
            // headers HTTP 请求头
            header: headers,
            data: body,
        };
    };


}
