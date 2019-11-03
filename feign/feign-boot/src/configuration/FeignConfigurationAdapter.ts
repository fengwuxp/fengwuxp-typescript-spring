import {
    ClientHttpRequestInterceptor,
    FeignClientExecutorInterceptor,
    HttpAdapter,
    HttpRequest,
} from "fengwuxp-typescript-feign";
import InterceptorRegistry from "../registry/InterceptorRegistry";


export interface FeignConfigurationAdapter {


    /**
     * get http adapter
     */
    httpAdapter?: <T extends HttpRequest = HttpRequest>() => HttpAdapter;


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
