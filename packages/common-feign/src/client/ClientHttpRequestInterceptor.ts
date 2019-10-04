import {HttpRequest} from "./HttpRequest";


/**
 * Intercepts client-side HTTP requests.
 */
export interface ClientHttpRequestInterceptorInterface<T extends HttpRequest = HttpRequest> {

    request: ClientHttpRequestInterceptorFunction<T>;
}


/**
 *  Intercept the given request, and return a response
 */
export type ClientHttpRequestInterceptorFunction<T extends HttpRequest = HttpRequest> = (req: T) => Promise<T>;

export type ClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> =
    ClientHttpRequestInterceptorFunction<T>
    | ClientHttpRequestInterceptorInterface<T>
