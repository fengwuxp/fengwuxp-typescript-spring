import {FeignConfiguration, FeignConfigurationConstructor} from "./FeignConfiguration";
import {FeignClientBuilder} from "../FeignClientBuilder";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";
import memoize from "lodash/memoize";

/**
 * FeignConfiguration
 */
let DEFAULT_CONFIGURATION: FeignConfiguration = null;

/**
 * feign builder
 */
let DEFAULT_FEIGN_BUILDER: FeignClientBuilder = null;


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
    // const description = feignConfigurationConstructor.name;
    // return description
    return feignConfigurationConstructor;
});


/**
 * 等待获取配置队列
 */
let WAIT_GET_CONFIGURATION_QUEUE: Array<(configuration: FeignConfiguration) => void> = [];

const registry = {


    setDefaultFeignConfiguration(configuration: FeignConfiguration) {
        DEFAULT_CONFIGURATION = memorizationConfiguration(configuration);
        if (WAIT_GET_CONFIGURATION_QUEUE.length > 0) {
            WAIT_GET_CONFIGURATION_QUEUE.forEach(fn => {
                fn(DEFAULT_CONFIGURATION);
            });
            // clear
            WAIT_GET_CONFIGURATION_QUEUE = [];
        }
    },

    getDefaultFeignConfiguration(): Promise<FeignConfiguration> {
        if (DEFAULT_CONFIGURATION != null) {
            return Promise.resolve(DEFAULT_CONFIGURATION);
        }
        return new Promise<FeignConfiguration>(resolve => {
            WAIT_GET_CONFIGURATION_QUEUE.push(resolve)
        });
    },

    setFeignClientBuilder(feignClientBuilder: FeignClientBuilder): void {
        DEFAULT_FEIGN_BUILDER = feignClientBuilder;
    },

    getFeignClientBuilder(): FeignClientBuilder {
        return DEFAULT_FEIGN_BUILDER || defaultFeignClientBuilder
    }
};
/**
 * feign configuration registry
 */
export default registry
