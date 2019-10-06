import {HttpClient, HttpRequestBody} from "./HttpClient";
import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpMethod} from "../constant/HttpMethod";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName} from "../constant/FeignConstVar";
import {
    ClientHttpRequestInterceptor,
    ClientHttpRequestInterceptorFunction,
    ClientHttpRequestInterceptorInterface
} from "./ClientHttpRequestInterceptor";
import {InterceptingHttpAccessor} from "./InterceptingHttpAccessor";
import {HttpMediaType} from "../constant/http/HttpMediaType";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";

/**
 * default http client
 */
export default class DefaultHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T> {

    private httpAdapter: HttpAdapter<T>;

    private interceptors: Array<ClientHttpRequestInterceptor<T>> = [];

    private defaultProduce;


    constructor(httpAdapter: HttpAdapter<T>,
                defaultProduce?: HttpMediaType,
                interceptors?: Array<ClientHttpRequestInterceptor<T>>) {
        this.httpAdapter = httpAdapter;
        this.setInterceptors(interceptors || []);
        this.defaultProduce = defaultProduce || HttpMediaType.APPLICATION_JSON_UTF8;
    }

    delete = (url: string, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            method: HttpMethod.DELETE,
            timeout
        } as T);
    };

    get = (url: string, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            method: HttpMethod.DELETE,
            timeout
        } as T);
    };

    head = (url: string, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            method: HttpMethod.HEAD,
            timeout
        } as T);
    };
    patch = (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            body,
            method: HttpMethod.PATCH,
            timeout
        } as T);
    };

    post = (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            body,
            method: HttpMethod.POST,
            timeout
        } as T);
    };

    put = (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number): Promise<HttpResponse> => {
        return this.send({
            url,
            headers,
            body,
            method: HttpMethod.PUT,
            timeout
        } as T);
    };

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
        requestData.body = serializeRequestBody(requestData.method, requestData.body, contentType, false);
        return this.httpAdapter.send(requestData);
    };

    getInterceptors = (): Array<ClientHttpRequestInterceptor<T>> => {
        // simple value copy
        return [...this.interceptors];
    };

    setInterceptors = (interceptors: Array<ClientHttpRequestInterceptor<T>>) => {
        this.interceptors.push(...interceptors);

        // filter null
        this.interceptors = this.interceptors.filter(o => o != null);
    };


}
