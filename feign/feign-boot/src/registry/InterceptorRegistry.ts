import ClientHttpInterceptorRegistration from "./ClientHttpInterceptorRegistration";
import FeignClientExecutorInterceptorRegistration from "./FeignClientExecutorInterceptorRegistration";
import {ClientHttpRequestInterceptor, FeignClientExecutorInterceptor} from "fengwuxp-typescript-feign";



export default class InterceptorRegistry {

    private clientHttpInterceptorRegistrations: ClientHttpInterceptorRegistration[] = [];

    private feignClientExecutorInterceptorRegistrations: FeignClientExecutorInterceptorRegistration[] = [];


    /**
     * add client Http Request interceptor
     * @param clientInterceptor
     */
    addClientInterceptor = (clientInterceptor: ClientHttpRequestInterceptor): ClientHttpInterceptorRegistration => {
        const clientHttpInterceptorRegistration = new ClientHttpInterceptorRegistration(clientInterceptor);
        this.clientHttpInterceptorRegistrations.push(clientHttpInterceptorRegistration);
        return clientHttpInterceptorRegistration;
    };

    /**
     * add feign client executor interceptor
     * @param feignClientExecutorInterceptor
     */
    addFeignClientExecutorInterceptor = (feignClientExecutorInterceptor: FeignClientExecutorInterceptor): FeignClientExecutorInterceptorRegistration => {
        const feignClientExecutorInterceptorRegistration = new FeignClientExecutorInterceptorRegistration(feignClientExecutorInterceptor);
        this.feignClientExecutorInterceptorRegistrations.push(feignClientExecutorInterceptorRegistration);
        return feignClientExecutorInterceptorRegistration;
    }

}
