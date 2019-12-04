import { FeignConfiguration } from "./FeignConfiguration";
declare const registry: {
    setDefaultFeignConfiguration(configuration: FeignConfiguration): void;
    getDefaultFeignConfiguration(): FeignConfiguration;
};
/**
 * feign configuration registry
 */
export default registry;
