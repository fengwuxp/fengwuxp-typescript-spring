import { FeignClient } from "./FeignClient";
import { FeignProxyClient } from "./support/FeignProxyClient";
/**
 * feign client executor
 */
export interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {
    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args        method params
     */
    invoke: (methodName: string, ...args: any[]) => Promise<any>;
}
