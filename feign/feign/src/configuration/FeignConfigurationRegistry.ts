import {FeignConfiguration} from "./FeignConfiguration";


/**
 * FeignConfiguration
 */
let DEFAULT_CONFIGURATION: FeignConfiguration = null;

const registry = {


    setDefaultFeignConfiguration(configuration: FeignConfiguration) {
        DEFAULT_CONFIGURATION = configuration;
    },

    getDefaultFeignConfiguration(): FeignConfiguration {
        return DEFAULT_CONFIGURATION;
    }
};
/**
 * feign configuration registry
 */
export default registry
