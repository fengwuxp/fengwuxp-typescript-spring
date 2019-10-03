import {HttpRequest} from "./HttpRequest";


/**
 * Intercepts client-side HTTP requests.
 */
interface ClientHttpRequestInterceptorInterface<T extends HttpRequest = HttpRequest> {

    request: ClientHttpRequestFunctionInterceptor<T>;
}


/**
 *  Intercept the given request, and return a response
 */
type ClientHttpRequestFunctionInterceptor<T extends HttpRequest = HttpRequest> = (req: T) => Promise<T>;

export type ClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> =
    ClientHttpRequestFunctionInterceptor<T>
    | ClientHttpRequestInterceptorInterface<T>
