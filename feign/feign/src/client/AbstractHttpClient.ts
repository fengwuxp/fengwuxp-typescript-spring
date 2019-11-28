import {HttpRequest} from "./HttpRequest";
import {HttpClient, HttpRequestBody} from "./HttpClient";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {ClientHttpRequestInterceptor} from "./ClientHttpRequestInterceptor";
import {HttpMediaType} from "../constant/http/HttpMediaType";
import {HttpResponse} from "./HttpResponse";
import {HttpMethod} from "../constant/http/HttpMethod";

/**
 * abstract http client
 */
export abstract class AbstractHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T> {

    protected httpAdapter: HttpAdapter<T>;

    protected interceptors: Array<ClientHttpRequestInterceptor<T>> = [];

    protected defaultProduce: HttpMediaType;

    protected constructor(httpAdapter: HttpAdapter<T>,
                          defaultProduce?: HttpMediaType,
                          interceptors?: Array<ClientHttpRequestInterceptor<T>>) {
        this.httpAdapter = httpAdapter;
        this.defaultProduce = defaultProduce || HttpMediaType.FORM_DATA;
        this.setInterceptors(interceptors || []);
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


    /**
     * send an http request to a remote server
     * @param req
     */
    abstract send: (req: T) => Promise<HttpResponse>;


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
