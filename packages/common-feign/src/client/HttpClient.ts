import {HttpResponse} from "./HttpResponse";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpRequest} from "./HttpRequest";
import {InterceptingHttpAccessor} from "./InterceptingHttpAccessor";

/**
 * http request body
 */
export type HttpRequestBody = string | Record<string, any>;

/**
 * http request client
 */
export interface HttpClient<T extends HttpRequest = HttpRequest> extends HttpAdapter<T>, InterceptingHttpAccessor {


    /**
     *  get request
     * @param url
     * @param headers
     * @param timeout
     */
    get: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;


    /**
     *  delete request
     * @param url
     * @param headers
     * @param timeout
     */
    delete: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;

    /**
     *  delete request
     * @param url
     * @param headers
     * @param timeout
     */
    head: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;

    /**
     * post request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    post: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;

    /**
     * put request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    put: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;

    /**
     * put request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    patch: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
}



