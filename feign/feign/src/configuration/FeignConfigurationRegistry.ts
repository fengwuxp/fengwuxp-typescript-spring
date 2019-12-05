import {FeignConfiguration} from "./FeignConfiguration";
import {FeignClientBuilder} from "../FeignClientBuilder";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";


/**
 * FeignConfiguration
 */
let DEFAULT_CONFIGURATION: FeignConfiguration = null;

/**
 * feign builder
 */
let DEFAULT_FEIGN_BUILDER: FeignClientBuilder = null;

const registry = {


    setDefaultFeignConfiguration(configuration: FeignConfiguration) {
        // console.log("set default configuration", configuration);
        DEFAULT_CONFIGURATION = configuration;
    },

    getDefaultFeignConfiguration(): FeignConfiguration {
        console.log("get default configuration", DEFAULT_CONFIGURATION);
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
