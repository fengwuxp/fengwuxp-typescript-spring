import {FeignConfigurationAdapter} from "./FeignConfigurationAdapter";
import {
    DefaultFeignClientExecutor, DefaultHttpClient, FeignConfiguration,
    FeignConfigurationRegistry,
    FeignProxyClient,
    HttpMediaType,
    RestTemplate
} from "fengwuxp-typescript-feign";
import FeignClientInterceptorRegistry from "./registry/FeignClientInterceptorRegistry";
import ClientHttpInterceptorRegistry from "./registry/ClientHttpInterceptorRegistry";


const genConfiguration = (feignConfigurationAdapter: FeignConfigurationAdapter) => {

    class A implements FeignConfiguration {
        getApiSignatureStrategy = feignConfigurationAdapter.apiSignatureStrategy;

        getFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient>(client) {
            return new DefaultFeignClientExecutor<T>(client);
        };

        getFeignClientExecutorInterceptors() {
            const feignClientInterceptorRegistry = new FeignClientInterceptorRegistry();
            feignConfigurationAdapter.registryFeignClientExecutorInterceptors(feignClientInterceptorRegistry);
            return feignClientInterceptorRegistry.getInterceptors();
        };

        getHttpAdapter = feignConfigurationAdapter.httpAdapter;

        getHttpClient() {
            const clientHttpInterceptorRegistry = new ClientHttpInterceptorRegistry();
            feignConfigurationAdapter.registryClientHttpRequestInterceptors(clientHttpInterceptorRegistry);
            return new DefaultHttpClient(
                this.getHttpAdapter(),
                typeof feignConfigurationAdapter.defaultProduce === "function" ? feignConfigurationAdapter.defaultProduce() : undefined,
                clientHttpInterceptorRegistry.getInterceptors()
            );
        };

        getRestTemplate() {
            return new RestTemplate(this.getHttpClient());
        }
    }

    return new A()
};

export const feignConfigurationInitializer = (feignConfigurationAdapter: FeignConfigurationAdapter) => {

    const configuration = genConfiguration(feignConfigurationAdapter);
    FeignConfigurationRegistry.setDefaultFeignConfiguration(configuration);
};
