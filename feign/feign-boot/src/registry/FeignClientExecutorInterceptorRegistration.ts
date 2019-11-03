import {InterceptorRegistration} from "./InterceptorRegistration";
import {FeignClientExecutorInterceptor, MappedFeignClientExecutorInterceptor} from "fengwuxp-typescript-feign";


export default class FeignClientExecutorInterceptorRegistration extends InterceptorRegistration {


    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor) {
        super(feignClientExecutorInterceptor);
    }

    public getInterceptor = (): MappedFeignClientExecutorInterceptor => {

        return new MappedFeignClientExecutorInterceptor(
            this.interceptor,
            this.includePatterns,
            this.excludePatterns,
            this.includeMethods,
            this.excludeMethods,
            this.includeHeaders,
            this.excludeHeaders
        );
    };

}
