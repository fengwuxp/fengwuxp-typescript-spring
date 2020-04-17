import { InterceptorRegistry } from "./InterceptorRegistry";
import FeignClientExecutorInterceptorRegistration from "./FeignClientExecutorInterceptorRegistration";
import { FeignClientExecutorInterceptor } from "fengwuxp-typescript-feign";
export default class FeignClientInterceptorRegistry implements InterceptorRegistry {
    private feignClientExecutorInterceptorRegistrations;
    addInterceptor: (interceptor: FeignClientExecutorInterceptor<import("fengwuxp-typescript-feign").FeignRequestBaseOptions>) => FeignClientExecutorInterceptorRegistration;
    getInterceptors: () => any[];
}
