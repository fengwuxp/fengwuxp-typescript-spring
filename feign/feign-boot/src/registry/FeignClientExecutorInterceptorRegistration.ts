import {InterceptorRegistration} from "./InterceptorRegistration";
import {FeignClientExecutorInterceptor, MappedFeignClientExecutorInterceptor} from "fengwuxp-typescript-feign";


export default class FeignClientExecutorInterceptorRegistration extends InterceptorRegistration {

    private feignClientExecutorInterceptor: FeignClientExecutorInterceptor;


    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor) {
        super();
        this.feignClientExecutorInterceptor = feignClientExecutorInterceptor;
    }


    public getInterceptor = (): MappedFeignClientExecutorInterceptor => {

        return new MappedFeignClientExecutorInterceptor(
            this.feignClientExecutorInterceptor,
            this.includePatterns,
            this.excludePatterns,
            this.includeMethods,
            this.excludeMethods,
            this.includeHeaders,
            this.excludeHeaders
        );
    };

}
