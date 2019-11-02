import {
    ClientHttpRequestInterceptor,
    FeignClientExecutorInterceptor,
    HttpAdapter,
    HttpRequest,
    InterceptorRegistry
} from "fengwuxp-typescript-feign";


export interface FeignConfigurationAdapter {


    /**
     * get http adapter
     */
    httpAdapter?: <T extends HttpRequest = HttpRequest>(htpAdapter: HttpAdapter) => HttpAdapter;


    /**
     * registry client http request interceptors
     * @param registry
     * @return  new interceptors
     */
    registryClientHttpRequestInterceptors?: (registry: InterceptorRegistry) => void;

    /**
     * registry feign client executor interceptors
     * @param registry
     * @return  new interceptors
     */
    registryFeignClientExecutorInterceptor?: (registry: InterceptorRegistry[]) => void;

}
