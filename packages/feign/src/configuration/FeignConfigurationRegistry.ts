import {FeignConfiguration} from "./FeignConfiguration";

const registry = {

    /**
     * FeignConfiguration
     */
    configuration: null,

    setDefaultFeignConfiguration(configuration: FeignConfiguration) {
        this.configuration = configuration;
    },

    getDefaultFeignConfiguration(): FeignConfiguration {
        return this.configuration
    }
};
/**
 * feign configuration registry
 */
export default registry
