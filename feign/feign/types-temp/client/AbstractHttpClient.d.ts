import { HttpRequest } from "./HttpRequest";
import { HttpClient, HttpRequestBody } from "./HttpClient";
import { HttpAdapter } from "../adapter/HttpAdapter";
import { ClientHttpRequestInterceptor } from "./ClientHttpRequestInterceptor";
import { HttpMediaType } from "../constant/http/HttpMediaType";
import { HttpResponse } from "./HttpResponse";
/**
 * abstract http client
 * Request header with 'Content-Type' as 'application / x-www-form-urlencoded' is provided by default
 */
export declare abstract class AbstractHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T> {
    protected httpAdapter: HttpAdapter<T>;
    protected interceptors: Array<ClientHttpRequestInterceptor<T>>;
    protected defaultProduce: HttpMediaType;
    protected constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    delete: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    get: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    head: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    patch: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    post: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    put: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    /**
     * send an http request to a remote server
     * @param req
     */
    abstract send: (req: T) => Promise<HttpResponse>;
    getInterceptors: () => ClientHttpRequestInterceptor<T>[];
    setInterceptors: (interceptors: ClientHttpRequestInterceptor<T>[]) => void;
}
