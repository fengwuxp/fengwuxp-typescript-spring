import {MappedInterceptor} from "./MappedInterceptor";
import {FeignRequestBaseOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpMethod} from "../constant/http/HttpMethod";
import {HttpResponse} from "../client/HttpResponse";
import {HttpRequest} from "../client/HttpRequest";


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

    postHandle = <E = HttpResponse<any>>(options: T, response: E) => {

        return this.feignClientExecutorInterceptor.postHandle(options, response);
    };

    preHandle = (options: T) => {
        return this.feignClientExecutorInterceptor.preHandle(options);
    };


}
