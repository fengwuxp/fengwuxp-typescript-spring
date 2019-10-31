import {MappedInterceptor} from "./MappedInterceptor";
import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpMethod} from "../constant/http/HttpMethod";
import {HttpResponse} from "../client/HttpResponse";


export default class MappedFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
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

    postHandle = <E = HttpResponse<any>>(options: T, response: E) => {

        return this.feignClientExecutorInterceptor.postHandle(options, response);
    };

    preHandle = (options: T) => {
        return this.feignClientExecutorInterceptor.preHandle(options);
    };

    /**
     * Determine a match for the given lookup path.
     * @param options
     * @param response
     * @return {@code true} if the interceptor applies to the given request path or http methods or http headers
     */
    matches = (options: T, response?): boolean => {
        if (response != null) {

        }

        const sources = [options.headers];
        return ["Headers"].some((methodName, index) => {
            return this[`matches${methodName}`](sources[index]);
        });
    };


}
