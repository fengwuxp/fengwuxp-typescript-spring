import { FeignClientBuilderFunction, FeignClientBuilderInterface } from "./FeignClientBuilder";
import { FeignProxyClient } from "./support/FeignProxyClient";
export declare class DefaultFeignClientBuilder implements FeignClientBuilderInterface {
    build: FeignClientBuilderFunction<FeignProxyClient>;
}
export declare const defaultFeignClientBuilder: FeignClientBuilderFunction;
