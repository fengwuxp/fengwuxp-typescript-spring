import {
    HttpAdapter,
    HttpRequest,
    HttpMediaType,
    MappedClientHttpRequestInterceptor,
    HttpClient,
    DefaultHttpClient
} from "fengwuxp-typescript-feign";


export default class HttpClientFactory {


    public static newHttpClient = <T extends HttpRequest = HttpRequest>(
        httpAdapter: HttpAdapter<T>,
        defaultProduce?: HttpMediaType,
        interceptors?: Array<MappedClientHttpRequestInterceptor<T>>) => {

        // const client: HttpClient<T> = {
        //
        //     get:(url: string, headers?: HeadersInit, timeout?: number)=>{
        //         return
        //     },
        //
        //     send: (req: T) => {
        //         return null;
        //     },
        //
        //     getInterceptors: () => {
        //
        //         return []
        //     }
        //
        // }
        return new DefaultHttpClient(httpAdapter, defaultProduce, interceptors);
    }
}
