import { HttpRequest } from "./HttpRequest";
import { HttpRetryOptions } from "./HttpRetryOptions";
import { HttpResponse } from "./HttpResponse";
import { HttpAdapter } from "../adapter/HttpAdapter";
import { AbstractHttpClient } from "./AbstractHttpClient";
import { HttpMediaType } from "../constant/http/HttpMediaType";
import { ClientHttpRequestInterceptor } from "./ClientHttpRequestInterceptor";
/**
 * support retry http client
 * HttpClient with retry, need to be recreated each time you use this client
 */
export default class RetryHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {
    private retryOptions;
    private countRetry;
    private retryEnd;
    constructor(httpAdapter: HttpAdapter<T>, retryOptions: HttpRetryOptions, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    send: (req: T) => Promise<HttpResponse<any>>;
    /**
     * try retry request
     * @param request
     * @param response
     */
    private tryRetry;
    /**
     * default retry handle
     * @param req
     * @param response
     */
    private onRetry;
    /**
     * whether to retry
     * @param response
     */
    private whenRetry;
}
