import {
    CommonResolveHttpResponse,
    HttpAdapter,
    HttpMethod,
    HttpResponse,
    ResolveHttpResponse,
    responseIsJson
} from "fengwuxp-typescript-feign";
import {WeexHttpRequest} from './WeexHttpRequest';


// @ts-ignore
const stream = weex.requireModule('stream');


enum WeexResponseType {
    JSON = 'json',
    TEXT = 'text'
}

/**
 * 基于weex http adapter
 *
 * weex stream对象  {@doc https://weex.apache.org/cn/references/modules/stream.html}
 */
export default class WeexHttpAdapter implements HttpAdapter<WeexHttpRequest> {

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

    send = (request: WeexHttpRequest): Promise<HttpResponse> => {
        //TODO 进行请求
        //返回统一的数据结果

        const req = this.buildRequest(request);

        return new Promise<HttpResponse>((resolve, reject) => {
            stream.fetch(req, (resp) => {
                //解析数据
                const data = this.resolveHttpResponse.resolve(resp);
                if (resp.ok) {
                    resolve(data);
                } else {
                    data.data = resp;
                    reject(data);
                }
            }, (response) => {
                if (response == null) {
                    return;
                }
                let requestProgress = request.requestProgress;
                if (typeof requestProgress !== "function") {
                    return;
                }
                //请求进度
                requestProgress(response as any);
            });
        });

    }


    private buildRequest = (reqParams: WeexHttpRequest) => {
        let {
            url,
            body,
            method,
            headers,
            timeout
        } = reqParams;

        headers = headers || {};


        const type = responseIsJson(headers) ? WeexResponseType.JSON : WeexResponseType.TEXT;
        return {
            //请求方法get post
            method: HttpMethod[method],
            //请求url
            url,
            //响应类型, json,text 或是 jsonp {在原生实现中其实与 json 相同)
            type,
            //headers HTTP 请求头
            headers,
            //参数仅支持 string 类型的参数，请勿直接传递 JSON，必须先将其转为字符串。GET请求不支持 body 方式传递参数，请使用 url 传参。
            body: body == null ? body : JSON.stringify(body),
            timeout
        };
    }
}