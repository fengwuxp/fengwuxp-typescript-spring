import {FeignClient} from "./FeignClient";
import {FeignProxyClient} from "./support/FeignProxyClient";


export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {

    /**
     * execute proxy service
     * @param apiService   feign client instance
     * @param methodName   method name
     * @param args        method params
     */
    execute: (apiService: T, methodName: string, ...args) => Promise<any>;
}
