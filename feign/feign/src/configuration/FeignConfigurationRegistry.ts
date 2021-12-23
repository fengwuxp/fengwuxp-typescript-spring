import {FeignClientBuilder} from "../FeignClientBuilder";
import memoize from "lodash/memoize";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";
import {FeignClientType, FeignConfigurationConstructor} from "../annotations/FeignClientAnnotationFactory";
import {BaseFeignClientConfiguration} from "../support/BaseFeignClientConfiguration";


// ignore memorization method names
const ignoreMethodNames = ["getFeignClientExecutor"];

const memorizationConfiguration = (configuration: BaseFeignClientConfiguration): BaseFeignClientConfiguration => {
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
const WAIT_GET_CONFIGURATION_QUEUE: Array<{
    [key: string]: Array<(handle: (val: BaseFeignClientConfiguration) => void) => void>
}> = [];

const getWaitConfigurationQueue = (type: FeignClientType, apiModule: string): Array<Function> => {
    if (WAIT_GET_CONFIGURATION_QUEUE[type] == null) {
        WAIT_GET_CONFIGURATION_QUEUE[type] = {};
    }
    return WAIT_GET_CONFIGURATION_QUEUE[type][apiModule];
}

const initWaitConfigurationQueue = (type: FeignClientType, apiModule: string) => {
    if (WAIT_GET_CONFIGURATION_QUEUE[type] == null) {
        WAIT_GET_CONFIGURATION_QUEUE[type] = {};
    }
    WAIT_GET_CONFIGURATION_QUEUE[type][apiModule] = [];
}


/**
 * @key apiModule
 * @value FeignConfiguration
 */
const CONFIGURATION_CACHES: Array<Record<string, any>> = [];

const getConfigurationCaches = <C extends BaseFeignClientConfiguration>(type: FeignClientType): Record<string, C> => {
    if (CONFIGURATION_CACHES[type] == null) {
        CONFIGURATION_CACHES[type] = {};
    }
    return CONFIGURATION_CACHES[type];
}
/**
 * feign builder
 */
const FEIGN_CLIENT_BUILDER_CACHES: Array<FeignClientBuilder> = [defaultFeignClientBuilder, defaultFeignClientBuilder];

const registry = {

    setFeignConfiguration(type: FeignClientType, apiModule: string, configuration: any) {
        getConfigurationCaches(type)[apiModule] = memorizationConfiguration(configuration);
        const waitQueue = getWaitConfigurationQueue(type, apiModule);
        if (getWaitConfigurationQueue(type, apiModule)?.length > 0) {
            waitQueue.forEach(fn => fn(configuration));
            // clear
            initWaitConfigurationQueue(type, apiModule);
        }
    },

    getFeignConfiguration<C extends BaseFeignClientConfiguration = BaseFeignClientConfiguration>(type: FeignClientType, apiModule: string): Promise<Readonly<C>> {
        const configuration = getConfigurationCaches<C>(type)[apiModule];
        if (configuration != null) {
            return Promise.resolve(configuration);
        }
        if (getWaitConfigurationQueue(type, apiModule) == null) {
            initWaitConfigurationQueue(type, apiModule);
        }
        return new Promise<C>(resolve => getWaitConfigurationQueue(type, apiModule).push(resolve));
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
