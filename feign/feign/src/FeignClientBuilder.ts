import {FeignProxyClient} from "./support/FeignProxyClient";
import {FeignClientType} from "./annotations/FeignClientAnnotationFactory";


export type FeignClientBuilderFunction<T extends FeignProxyClient = FeignProxyClient> = (client: T, clientType: FeignClientType) => T;

/**
 * feign client builder
 */
export interface FeignClientBuilderInterface<T extends FeignProxyClient = FeignProxyClient> {

    build: FeignClientBuilderFunction<T>;

}


export type FeignClientBuilder<T extends FeignProxyClient = FeignProxyClient> =
    FeignClientBuilderFunction<T>
    | FeignClientBuilderInterface<T>
