import {HttpRequest} from "./HttpRequest";


/**
 * Intercepts client-side HTTP requests.
 */
export interface ClientHttpRequestInterceptorInterface<T extends HttpRequest = HttpRequest> {

    interceptor: ClientHttpRequestInterceptorFunction<T>;
}


/**
 *  Intercept the given request, and return a response
 */
export type ClientHttpRequestInterceptorFunction<T extends HttpRequest = HttpRequest> = (req: T) => Promise<T>;

/**
 * Throw an exception or Promise.reject will interrupt the request
 */
export type ClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> =
    ClientHttpRequestInterceptorFunction<T>
    | ClientHttpRequestInterceptorInterface<T>
