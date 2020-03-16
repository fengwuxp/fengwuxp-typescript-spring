import {
    HttpAdapter,
    HttpResponse,
    HttpStatus,
} from "fengwuxp-typescript-feign";
import {TarojsHttpRequest} from "./TarojsHttpRequest";
import Taro, {request} from "@tarojs/taro";


/**
 * tarojs http adaptor
 */
export default class TarojsHttpAdaptor implements HttpAdapter<TarojsHttpRequest> {

    private timeout: number;


    /**
     *
     * @param timeout  default 5000ms
     */
    constructor(timeout?: number) {
        this.timeout = timeout || 5 * 1000;
    }

    send = (req: TarojsHttpRequest): Promise<HttpResponse> => {
        const param = this.buildRequest(req);
        return Taro.request(param).then((resp) => {
            const ok = resp.statusCode >= 200 && resp.statusCode < 300;
            return {
                data: resp.data,
                headers: resp.header,
                ok,
                statusCode: resp.statusCode
            }
        });
    };
    private buildRequest = (options: TarojsHttpRequest): request.Option<any> => {

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
            dataType: dataType as any,
            responseType: responseType as any,
            cache: (cache as any),
            credentials,
            mode: (mode as any),
            //headers HTTP 请求头
            header: headers,
            data: body,
        };

    };
}
