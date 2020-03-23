import {FeignRequestBaseOptions} from "./FeignRequestOptions";
import {HttpResponse} from "./client/HttpResponse";

/**
 * Only executed in feign client
 * {@see FeignClientExecutor#invoke}
 * {@see DefaultFeignClientExecutor#invoke}
 */
export interface FeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> {

    /**
     * in request before invoke
     * @param options feign request options
     * @return new options
     */
    preHandle?: (options: T) => T | Promise<T>;

    /**
     * in request after invoke
     * @param options
     * @param response
     */
    postHandle?: <E = HttpResponse<any>>(options: T, response: E) => Promise<any> | any;


    /**
     * in request failure invoke
     * @param options
     * @param response
     */
    postError?: (options: T, response: HttpResponse<any>) => Promise<any> | any;

}

