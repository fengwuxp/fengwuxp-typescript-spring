import {FeignConfiguration} from "./FeignConfiguration";


class FeignConfigurationRegistry {


    private configuration: FeignConfiguration;

    setDefaultFeignConfiguration = (configuration: FeignConfiguration) => {
        this.configuration = configuration;
    };

    getDefaultFeignConfiguration = () => this.configuration;
}

export default new FeignConfigurationRegistry();
