import {getInterceptors, InterceptorRegistry} from './InterceptorRegistry';
import ClientHttpInterceptorRegistration from "./ClientHttpInterceptorRegistration";


export default class ClientHttpInterceptorRegistry implements InterceptorRegistry {


    private clientHttpInterceptorRegistrations: ClientHttpInterceptorRegistration[] = [];

    addInterceptor = (interceptor): ClientHttpInterceptorRegistration => {
        const clientHttpInterceptorRegistration = new ClientHttpInterceptorRegistration(interceptor);
        this.clientHttpInterceptorRegistrations.push(clientHttpInterceptorRegistration);
        return clientHttpInterceptorRegistration;
    };

    getInterceptors = () => {
        return getInterceptors(this.clientHttpInterceptorRegistrations)
    };


}
