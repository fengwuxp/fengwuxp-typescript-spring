import {FeignClientBuilderFunction, FeignClientBuilderInterface} from "./FeignClientBuilder";
import {newProxyInstance,ProxyScope} from "fengwuxp-common-proxy";
import {FeignProxyClient} from "./support/FeignProxyClient";
import FeignConfigurationRegistry from "./configuration/FeignConfigurationRegistry";


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

    const feignClientExecutor = FeignConfigurationRegistry.getDefaultFeignConfiguration().getFeignClientExecutor(client);

    return newProxyInstance<T>(
        client, (target: T, serviceMethod: string, receiver: any) => {
            return (...args) => {
                // different proxy service executors can be returned according to different strategies
                return feignClientExecutor.invoke(serviceMethod, ...args);
            };
        }, null,
        ProxyScope.METHOD,
        (object, key) => {
            const isIgnore = ignorePropertyNames.some((item) => item === key);
            return !isIgnore;
        }
    );
};
