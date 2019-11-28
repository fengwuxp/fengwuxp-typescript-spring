import {FeignConfiguration} from "./FeignConfiguration";


/**
 * FeignConfiguration
 */
let DEFAULT_CONFIGURATION: FeignConfiguration = null;

const registry = {


    setDefaultFeignConfiguration(configuration: FeignConfiguration) {
        console.log("set default configuration",configuration);
        DEFAULT_CONFIGURATION = configuration;
    },

    getDefaultFeignConfiguration(): FeignConfiguration {
        console.log("get default configuration",DEFAULT_CONFIGURATION);
        return DEFAULT_CONFIGURATION;
    }
};
/**
 * feign configuration registry
 */
export default registry
