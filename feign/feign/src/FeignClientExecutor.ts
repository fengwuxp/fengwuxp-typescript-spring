import {FeignClient} from "./FeignClient";
import {FeignProxyClient} from "./support/FeignProxyClient";


/**
 * feign client executor
 */
export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient, R = Promise<any>> {

    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args  method params
     */
    invoke: (methodName: string, ...args) => R;
}


export type FeignClientExecutorFactory<T extends FeignClient = FeignProxyClient> = (client: T) => FeignClientExecutor;
