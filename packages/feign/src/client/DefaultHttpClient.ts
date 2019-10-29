import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName} from "../constant/FeignConstVar";
import {ClientHttpRequestInterceptor, ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import AbstractHttpClient from "./AbstractHttpClient";
import {HttpMediaType} from "../constant/http/HttpMediaType";

/**
 * default http client
 */
export default class DefaultHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {


    constructor(httpAdapter: HttpAdapter<T>,
                defaultProduce?: HttpMediaType,
                interceptors?: Array<ClientHttpRequestInterceptor<T>>) {
        super(httpAdapter, defaultProduce, interceptors);
    }

    send = async (req: T): Promise<HttpResponse> => {

        const {defaultProduce, interceptors} = this;

        const len = interceptors.length;
        let index = 0;
        let requestData: T = req;
        while (index < len) {
            const interceptor = interceptors[index];
            index++;
            const clientHttpRequestInterceptorInterface = invokeFunctionInterface<ClientHttpRequestInterceptor<T>, ClientHttpRequestInterceptorInterface<T>>(interceptor);
            if (clientHttpRequestInterceptorInterface == null) {
                continue;
            }
            try {
                requestData = await clientHttpRequestInterceptorInterface.interceptor(requestData);
            } catch (e) {
                // error ignore
                console.error("http request interceptor handle exception", e);
            }
        }

        const contentType = requestData.headers == null ? defaultProduce : requestData.headers[contentTypeName] || defaultProduce;
        requestData.body = serializeRequestBody(requestData.method, requestData.body, contentType as HttpMediaType, false);
        return this.httpAdapter.send(requestData);
    };

}
