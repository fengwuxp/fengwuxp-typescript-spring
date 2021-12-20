import {FeignConfiguration, FeignConfigurationConstructor} from "./FeignConfiguration";
import {FeignClientBuilder} from "../FeignClientBuilder";
import memoize from "lodash/memoize";
import {FeignClientType} from "../annotations/Feign";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";


// ignore memorization method names
const ignoreMethodNames = ["getFeignClientExecutor"];

const memorizationConfiguration = (configuration: FeignConfiguration): FeignConfiguration => {
    if (configuration == null) {
        return;
    }
    const newConfiguration: any = {};
    for (const key in configuration) {
        const configurationElement = configuration[key];
        const needMemoize = ignoreMethodNames.indexOf(key) < 0 && typeof configurationElement === "function";
        if (needMemoize) {
            newConfiguration[key] = memoize(configurationElement, () => configurationElement);
        } else {
            newConfiguration[key] = configurationElement;
        }
    }
    return newConfiguration;
};

const factory = (feignConfigurationConstructor: FeignConfigurationConstructor) => {
    return memorizationConfiguration(new feignConfigurationConstructor());
};

/**
 * feign configuration factory
 */
export const configurationFactory = memoize(factory, (feignConfigurationConstructor: FeignConfigurationConstructor) => {
    if (feignConfigurationConstructor == null) {
        return 0;
    }
    return feignConfigurationConstructor;
});


/**
 * 等待获取配置队列
 */
const WAIT_GET_CONFIGURATION_QUEUE: {
    [key: string]: Array<(configuration: FeignConfiguration) => void>
} = {};

const getWaitConfigurationQueue = (apiModule: string) => {
    return WAIT_GET_CONFIGURATION_QUEUE[apiModule];
}

const initWaitConfigurationQueue = (apiModule: string) => {
    WAIT_GET_CONFIGURATION_QUEUE[apiModule] = [];
}


/**
 * @key apiModule
 * @value FeignConfiguration
 */
const CONFIGURATION_CACHES: { [key: string]: FeignConfiguration } = {};

/**
 * feign builder
 */
const FEIGN_CLIENT_BUILDER_CACHES: Array<FeignClientBuilder> = [defaultFeignClientBuilder, null];

const registry = {

    setFeignConfiguration(apiModule: string, configuration: FeignConfiguration) {
        CONFIGURATION_CACHES[apiModule] = memorizationConfiguration(configuration);
        const waitQueue = getWaitConfigurationQueue(apiModule);
        if (getWaitConfigurationQueue(apiModule)?.length > 0) {
            waitQueue.forEach(fn => fn(configuration));
            // clear
            initWaitConfigurationQueue(apiModule);
        }
    },

    getFeignConfiguration(apiModule: string): Promise<Readonly<FeignConfiguration>> {
        const configuration = CONFIGURATION_CACHES[apiModule];
        if (configuration != null) {
            return Promise.resolve(configuration);
        }
        if (getWaitConfigurationQueue(apiModule) == null) {
            initWaitConfigurationQueue(apiModule);
        }
        return new Promise<FeignConfiguration>(resolve => getWaitConfigurationQueue(apiModule).push(resolve));
    },

    setFeignClientBuilder(type: FeignClientType, feignClientBuilder: FeignClientBuilder): void {
        FEIGN_CLIENT_BUILDER_CACHES[type] = feignClientBuilder;
    },

    getFeignClientBuilder(type: FeignClientType): FeignClientBuilder {
        const builder = FEIGN_CLIENT_BUILDER_CACHES[type];
        if (builder == null) {
            throw new Error(`not found type = ${type} client builder`);
        }
        return builder;
    }
};
/**
 * feign configuration registry
 */
export default registry
