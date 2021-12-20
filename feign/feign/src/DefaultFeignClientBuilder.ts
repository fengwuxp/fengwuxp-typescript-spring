import {FeignClientBuilderFunction, FeignClientBuilderInterface} from "./FeignClientBuilder";
import {newProxyInstance, ProxyScope} from "fengwuxp-common-proxy";
import {FeignProxyClient} from "./support/FeignProxyClient";


export class DefaultFeignClientBuilder implements FeignClientBuilderInterface {

    build = defaultFeignClientBuilder;

}

/**
 * ignore property and method
 */
const ignorePropertyNames: string[] = [
    "getFeignMethodConfig",
    "setFeignMethodConfig"
];


export const defaultFeignClientBuilder: FeignClientBuilderFunction = <T extends FeignProxyClient = FeignProxyClient>(client: T): T => {

    return newProxyInstance<T>(
        client, (target: T, serviceMethod: string, receiver: any) => {
            return async (...args) => {
                const feignConfiguration = await target.feignConfiguration();
                const feignClientExecutor = feignConfiguration.getFeignClientExecutor(client);
                // different proxy service executors can be returned according to different strategies
                return feignClientExecutor.invoke(serviceMethod, ...args);
            };
        }, null,
        ProxyScope.METHOD,
        (object, key) => {
            return !ignorePropertyNames.includes(key)
        }
    );
};
