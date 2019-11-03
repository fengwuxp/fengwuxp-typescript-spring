import {
    ClientHttpRequestInterceptor,
    DefaultHttpClient,
    HttpAdapter,
    HttpMediaType,
    HttpRequest
} from "fengwuxp-typescript-feign";


export const newHttpClient = <T extends HttpRequest = HttpRequest>(
    httpAdapter: HttpAdapter<T>,
    defaultProduce?: HttpMediaType,
    interceptors?: Array<ClientHttpRequestInterceptor<T>>) => {
    return new DefaultHttpClient(httpAdapter, defaultProduce, interceptors);
};
