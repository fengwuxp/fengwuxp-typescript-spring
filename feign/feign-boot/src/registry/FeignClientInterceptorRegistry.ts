import {getInterceptors, InterceptorRegistry} from "./InterceptorRegistry";
import FeignClientExecutorInterceptorRegistration from "./FeignClientExecutorInterceptorRegistration";
import {FeignClientExecutorInterceptor} from "fengwuxp-typescript-feign";


export default class FeignClientInterceptorRegistry implements InterceptorRegistry {

    private feignClientExecutorInterceptorRegistrations: FeignClientExecutorInterceptorRegistration[] = [];

    addInterceptor = (interceptor: FeignClientExecutorInterceptor): FeignClientExecutorInterceptorRegistration => {
        const feignClientExecutorInterceptorRegistration = new FeignClientExecutorInterceptorRegistration(interceptor);
        this.feignClientExecutorInterceptorRegistrations.push(feignClientExecutorInterceptorRegistration);
        return feignClientExecutorInterceptorRegistration;
    };
    getInterceptors = () => {
        return getInterceptors(this.feignClientExecutorInterceptorRegistrations)
    };
}
