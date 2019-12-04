import { FeignProxyClient } from "./support/FeignProxyClient";
/**
 * feign client builder
 */
export interface FeignClientBuilderInterface<T extends FeignProxyClient = FeignProxyClient> {
    build: FeignClientBuilderFunction<T>;
}
export declare type FeignClientBuilderFunction<T extends FeignProxyClient = FeignProxyClient> = (client: T) => T;
export declare type FeignClientBuilder<T extends FeignProxyClient = FeignProxyClient> = FeignClientBuilderFunction<T> | FeignClientBuilderInterface<T>;
