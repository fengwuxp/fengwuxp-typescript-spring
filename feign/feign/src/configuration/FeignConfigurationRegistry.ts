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


memoize.Cache = WeakMap;

const memorizationConfiguration = (configuration: FeignConfiguration): FeignConfiguration => {
    if (configuration == null) {
        return;
    }
    const newConfiguration: any = {};
    for (const key in configuration) {
        const configurationElement = configuration[key];
        if (typeof configurationElement === "function") {
            newConfiguration[key] = memoize(configurationElement, () => configurationElement)
        }
    }
    return newConfiguration
};

const factory = (feignConfigurationConstructor: FeignConfigurationConstructor) => {
    return memorizationConfiguration(new feignConfigurationConstructor());
};

export const configurationFactory = memoize(factory, (feignConfigurationConstructor: FeignConfigurationConstructor) => {
    if (feignConfigurationConstructor == null) {
        return 0;
    }
    // const description = feignConfigurationConstructor.name;
    // return description
    return feignConfigurationConstructor;
});

const registry = {


    setDefaultFeignConfiguration(configuration: FeignConfiguration) {

        DEFAULT_CONFIGURATION = memorizationConfiguration(configuration);
    },

    getDefaultFeignConfiguration(): FeignConfiguration {
        // console.log("get default configuration", DEFAULT_CONFIGURATION);
        return DEFAULT_CONFIGURATION;
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
