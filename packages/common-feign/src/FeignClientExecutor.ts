import {FeignClient} from "./FeignClient";
import {FeignProxyClient} from "./support/FeignProxyClient";


export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {

    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args        method params
     */
    invoke: (methodName: string, ...args) => Promise<any>;
}
