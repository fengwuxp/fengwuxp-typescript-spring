import {getInterceptors, InterceptorRegistry} from './InterceptorRegistry';
import ClientHttpInterceptorRegistration from "./ClientHttpInterceptorRegistration";
import {ClientHttpRequestInterceptor} from "fengwuxp-typescript-feign";


export default class ClientHttpInterceptorRegistry implements InterceptorRegistry {


    private clientHttpInterceptorRegistrations: ClientHttpInterceptorRegistration[] = [];

    addInterceptor = (interceptor: ClientHttpRequestInterceptor): ClientHttpInterceptorRegistration => {
        const clientHttpInterceptorRegistration = new ClientHttpInterceptorRegistration(interceptor);
        this.clientHttpInterceptorRegistrations.push(clientHttpInterceptorRegistration);
        return clientHttpInterceptorRegistration;
    };

    getInterceptors = () => {
        return getInterceptors(this.clientHttpInterceptorRegistrations)
    };


}
