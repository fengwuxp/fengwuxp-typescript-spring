import {FeignClient} from "./FeignClient";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {FeignRequestBaseOptions} from "./FeignRequestOptions";
import {HttpResponse} from "./client/HttpResponse";


export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {

    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args        method params
     */
    invoke: (methodName: string, ...args) => Promise<any>;
}


export interface FeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> {

    preHandle: (options: T) => T | Promise<T>;

    postHandle: <E = HttpResponse<any>>(options: T, response: E) => Promise<any> | any;

}
