import {FeignClient} from "./FeignClient";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {FeignRequestBaseOptions} from "./FeignRequestOptions";
import {HttpResponse} from "./client/HttpResponse";


/**
 * feign client executor
 */
export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {

    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args        method params
     */
    invoke: (methodName: string, ...args) => Promise<any>;
}

/**
 * execute interceptor
 */
export interface FeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> {

    /**
     * in request before invoke
     * @param options feign request options
     * @return new options
     */
    preHandle: (options: T) => T | Promise<T>;

    /**
     * in request after invoke
     * @param options
     * @param response
     */
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => Promise<any> | any;

}
