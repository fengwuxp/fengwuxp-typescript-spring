import {HttpClient, HttpRequestBody} from "./HttpClient";
import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpMethod} from "../constant/HttpMethod";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName} from "../constant/FeignConstVar";
import {ClientHttpRequestInterceptor} from "./ClientHttpRequestInterceptor";
import {InterceptingHttpAccessor} from "./InterceptingHttpAccessor";

/**
 * default http client
 */
export default class DefaultHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T>, InterceptingHttpAccessor {

    private httpAdapter: HttpAdapter<T>;

    private interceptors: Array<ClientHttpRequestInterceptor> = [];


    constructor(httpAdapter: HttpAdapter<T>, interceptors?: Array<ClientHttpRequestInterceptor >) {
        this.httpAdapter = httpAdapter;
        this.setInterceptors(interceptors || [])
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

        const interceptors = this.interceptors, len = interceptors.length;
        let index = 0;
        let result: HttpRequest = req;
        while (index < len) {
            const interceptor = interceptors[index];
            index++;
            const handle = typeof interceptor === "function" ? interceptor : interceptor.request;
            if (handle == null) {
                continue;
            }
            try {
                result = await handle(result);
            } catch (e) {
                // error ignore
                console.error("http request interceptor handle exception", e);
            }
        }

        req.body = serializeRequestBody(req.method, req.body, req.headers[contentTypeName], false);
        return this.httpAdapter.send(req);
    };

    getInterceptors = (): Array<ClientHttpRequestInterceptor> => {
        // simple value copy
        return [...this.interceptors];
    };

    setInterceptors = (interceptors: Array<ClientHttpRequestInterceptor>) => {
        this.interceptors.push(...interceptors);

        // filter null
        this.interceptors = this.interceptors.filter(o => o != null);
    };


}
