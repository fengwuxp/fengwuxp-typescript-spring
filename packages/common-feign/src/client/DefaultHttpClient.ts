import {HttpClient, HttpRequestBody} from "./HttpClient";
import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpMethod} from "../constant/HttpMethod";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName} from "../constant/FeignConstVar";

/**
 * default http client
 */
export default class DefaultHttpClient<T extends HttpRequest> implements HttpClient<T> {

    private httpAdapter: HttpAdapter<T>;


    constructor(httpAdapter: HttpAdapter<T>) {
        this.httpAdapter = httpAdapter;
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

    send = (req: T): Promise<HttpResponse> => {
        req.body = serializeRequestBody(req.method, req.body, req.headers[contentTypeName], false);
        return this.httpAdapter.send(req);
    };


}
