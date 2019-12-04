import { MappedInterceptor } from "./MappedInterceptor";
import { FeignRequestBaseOptions } from "../FeignRequestOptions";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
import { HttpMethod } from "../constant/http/HttpMethod";
import { HttpResponse } from "../client/HttpResponse";
export default class MappedFeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> extends MappedInterceptor implements FeignClientExecutorInterceptor<T> {
    private feignClientExecutorInterceptor;
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor<T>, includePatterns?: string[], excludePatterns?: string[], includeMethods?: HttpMethod[], excludeMethods?: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => any;
    preHandle: (options: T) => T | Promise<T>;
}
