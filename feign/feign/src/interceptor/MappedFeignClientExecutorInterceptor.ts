import {MappedInterceptor} from "./MappedInterceptor";
import {FeignRequestBaseOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpMethod} from "../constant/http/HttpMethod";
import {HttpResponse} from "../client/HttpResponse";


export default class MappedFeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions>
    extends MappedInterceptor implements FeignClientExecutorInterceptor<T> {

    private feignClientExecutorInterceptor: FeignClientExecutorInterceptor<T>;


    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor<T>,
                includePatterns?: string[],
                excludePatterns?: string[],
                includeMethods?: HttpMethod[],
                excludeMethods?: HttpMethod[],
                includeHeaders?: string[][],
                excludeHeaders?: string[][]) {
        super(includePatterns, excludePatterns, includeMethods, excludeMethods, includeHeaders, excludeHeaders);
        this.feignClientExecutorInterceptor = feignClientExecutorInterceptor;

    }

    preHandle = (options: T) => {
        return this.invokeHandle(this.feignClientExecutorInterceptor.preHandle, () => options, options);
    };

    postHandle = <E = HttpResponse<any>>(options: T, response: E) => {

        return this.invokeHandle(this.feignClientExecutorInterceptor.postHandle, () => response, options, response);
    };


    postError = (options: T, response: HttpResponse<any>) => {
        return this.invokeHandle(this.feignClientExecutorInterceptor.postError, () => response, options, response);
    };

    private invokeHandle = (handle: Function, isNotHandle: Function, ...args) => {
        if (typeof handle == "function") {
            return handle(...args);
        }

        return isNotHandle();
    }

}
