import {FeignClientExecutorInterceptor} from "../../../../packages/feign/src/FeignClientExecutor";
import {ClientHttpRequestInterceptor} from "../../../../packages/feign/src/client/ClientHttpRequestInterceptor";
import {HttpAdapter, HttpRequest} from "../../../../packages/feign/src";


export interface FeignConfigurationAdapter {


    /**
     * get http adapter
     */
    httpAdapter?: <T extends HttpRequest = HttpRequest>(htpAdapter: HttpAdapter) => HttpAdapter;


    /**
     * registry client http request interceptors
     * @param interceptors  default interceptors
     * @return  new interceptors
     */
    registryClientHttpRequestInterceptors?: (interceptors: ClientHttpRequestInterceptor[]) => ClientHttpRequestInterceptor[]

    /**
     * registry feign client executor interceptors
     * @param interceptors  default interceptors
     * @return  new interceptors
     */
    registryFeignClientExecutorInterceptor?: (interceptors: FeignClientExecutorInterceptor[]) => FeignClientExecutorInterceptor[];

}
