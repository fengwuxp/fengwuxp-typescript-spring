import {HttpAdapter} from "fengwuxp-typescript-feign/src/adapter/HttpAdapter";
import {BrowserHttpRequest} from "fengwuxp-typescript-feign/src/adapter/browser/BrowserHttpRequest";
import TaroJsHolder, {TaroInterfaceHolder} from "../TaroJsHolder";
import {HttpResponse} from "fengwuxp-typescript-feign/src/client/HttpResponse";
import {ResolveHttpResponse} from "../../../../packages/feign/src/resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../../../packages/feign/src/resolve/CommonResolveHttpResponse";


/**
 * taro http request adapter
 */
export default class TaroHttpAdapter implements HttpAdapter<BrowserHttpRequest> {

    protected taroHolder: TaroInterfaceHolder;

    private resolveHttpResponse: ResolveHttpResponse;

    private timeout: number;

    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>) {
        this.timeout = timeout || 5 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
        this.taroHolder = TaroJsHolder.getTaroHolder();
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
    }

    send = (request: BrowserHttpRequest): Promise<HttpResponse> => {

        return this.taroHolder.taro.request(this.buildRequest(request)).then(this.resolveHttpResponse.resolve);
    };

    private buildRequest = (request: BrowserHttpRequest): Taro.request.Param<any> => {

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
            //请求方法get post
            method: method as any,
            timeout: timeout || this.timeout,
            //请求url
            url,
            //响应类型,
            dataType: "",
            cache: (cache as any),
            credentials,
            mode: (mode as any),
            //headers HTTP 请求头
            header: headers,
            data: body,
        };
    };


}
