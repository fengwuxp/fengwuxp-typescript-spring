import {getInterceptors, InterceptorRegistry} from "./InterceptorRegistry";
import FeignClientExecutorInterceptorRegistration from "./FeignClientExecutorInterceptorRegistration";


export default class FeignClientInterceptorRegistry implements InterceptorRegistry {

    private feignClientExecutorInterceptorRegistrations: FeignClientExecutorInterceptorRegistration[] = [];

    addInterceptor = (interceptor): FeignClientExecutorInterceptorRegistration => {
        const feignClientExecutorInterceptorRegistrations = new FeignClientExecutorInterceptorRegistration(interceptor);
        this.feignClientExecutorInterceptorRegistrations.push(interceptor);
        return feignClientExecutorInterceptorRegistrations;
    };
    getInterceptors = () => {
        return getInterceptors(this.feignClientExecutorInterceptorRegistrations)
    };
}
