import {FeignClientBuilderFunction, FeignClientBuilderInterface} from "./FeignClientBuilder";
import {newProxyInstance, ProxyScope} from "fengwuxp-common-proxy";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {FeignHttpConfiguration} from "./configuration/FeignHttpConfiguration";
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

export const defaultFeignClientBuilder: FeignClientBuilderFunction = <T extends FeignProxyClient<FeignHttpConfiguration> = FeignProxyClient<FeignHttpConfiguration>>(client: T, clientType): T => {
    const executor = FeignConfigurationRegistry.getFeignClientExecutorFactory(clientType)(client);
    return newProxyInstance<T>(client, (target: T, serviceMethod: string, receiver: any) => {
            return (...args) => {
                // different proxy service executors can be returned according to different strategies
                return executor.invoke(serviceMethod, ...args);
            };
        },
        null,
        ProxyScope.METHOD,
        (object, key) => {
            return !ignorePropertyNames.includes(key)
        }
    );
};
