import { HttpRequest } from "../client/HttpRequest";
import { ClientHttpRequestInterceptor, ClientHttpRequestInterceptorInterface } from "../client/ClientHttpRequestInterceptor";
import { HttpMethod } from "../constant/http/HttpMethod";
import { MappedInterceptor } from "./MappedInterceptor";
/**
 * match interceptor
 */
export default class MappedClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> extends MappedInterceptor implements ClientHttpRequestInterceptorInterface<T> {
    private clientInterceptor;
    constructor(clientInterceptor: ClientHttpRequestInterceptor<T>, includePatterns?: string[], excludePatterns?: string[], includeMethods?: HttpMethod[], excludeMethods?: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    interceptor: (req: T) => Promise<T>;
}
