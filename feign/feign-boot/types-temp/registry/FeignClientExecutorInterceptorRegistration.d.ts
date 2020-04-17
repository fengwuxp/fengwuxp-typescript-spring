import { InterceptorRegistration } from "./InterceptorRegistration";
import { FeignClientExecutorInterceptor, MappedFeignClientExecutorInterceptor } from "fengwuxp-typescript-feign";
export default class FeignClientExecutorInterceptorRegistration extends InterceptorRegistration {
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor);
    getInterceptor: () => MappedFeignClientExecutorInterceptor<import("fengwuxp-typescript-feign").FeignRequestBaseOptions>;
}
