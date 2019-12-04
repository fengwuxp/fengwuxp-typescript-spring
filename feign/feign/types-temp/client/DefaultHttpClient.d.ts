import { HttpResponse } from "./HttpResponse";
import { HttpRequest } from "./HttpRequest";
import { HttpAdapter } from "../adapter/HttpAdapter";
import { ClientHttpRequestInterceptor } from "./ClientHttpRequestInterceptor";
import { AbstractHttpClient } from "./AbstractHttpClient";
import { HttpMediaType } from "../constant/http/HttpMediaType";
/**
 * default http client
 *
 */
export default class DefaultHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {
    constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    send: (req: T) => Promise<HttpResponse<any>>;
    private resolveContentType;
}
