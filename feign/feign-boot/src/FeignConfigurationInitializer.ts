import {FeignConfigurer} from "./FeignConfigurer";
import {
    defaultApiModuleName,
    DefaultFeignClientExecutor,
    DefaultHttpClient,
    FeignConfiguration,
    FeignConfigurationRegistry,
    FeignProxyClient,
    HttpResponseEventPublisher,
    RestTemplate,
    SimpleHttpResponseEventListener,
    SimpleHttpResponseEventPublisher,
    SmartHttpResponseEventListener
} from "fengwuxp-typescript-feign";
import FeignClientInterceptorRegistry from "./registry/FeignClientInterceptorRegistry";
import ClientHttpInterceptorRegistry from "./registry/ClientHttpInterceptorRegistry";


const buildConfiguration = (feignConfigurationAdapter: FeignConfigurer) => {

    const httpResponseEventListener = new SimpleHttpResponseEventListener();
    const httpResponseEventPublisher = new SimpleHttpResponseEventPublisher(httpResponseEventListener);

    class _InnerFeignConfiguration implements FeignConfiguration {

        getApiSignatureStrategy = feignConfigurationAdapter.apiSignatureStrategy;

        getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client) => {
            return new DefaultFeignClientExecutor<T>(client);
        };

        getFeignClientExecutorInterceptors = () => {
            const feignClientInterceptorRegistry = new FeignClientInterceptorRegistry();
            feignConfigurationAdapter.registryFeignClientExecutorInterceptors(feignClientInterceptorRegistry);
            return feignClientInterceptorRegistry.getInterceptors();
        };

        getHttpAdapter = () => {
            return feignConfigurationAdapter.httpAdapter();
        };

        getHttpClient = () => {
            const clientHttpInterceptorRegistry = new ClientHttpInterceptorRegistry();
            feignConfigurationAdapter.registryClientHttpRequestInterceptors(clientHttpInterceptorRegistry);
            return new DefaultHttpClient(
                this.getHttpAdapter(),
                typeof feignConfigurationAdapter.defaultProduce === "function" ? feignConfigurationAdapter.defaultProduce() : undefined,
                clientHttpInterceptorRegistry.getInterceptors()
            );
        };

        getRestTemplate = () => {
            return new RestTemplate(this.getHttpClient(),
                feignConfigurationAdapter.getBusinessResponseExtractor == null ? undefined : feignConfigurationAdapter.getBusinessResponseExtractor());
        };

        getHttpResponseEventListener = (): SmartHttpResponseEventListener => {
            return httpResponseEventListener;
        }

        getHttpResponseEventPublisher = (): HttpResponseEventPublisher => {
            return httpResponseEventPublisher;
        }

        getAuthenticationStrategy = feignConfigurationAdapter.authenticationStrategy;
        getRequestURLResolver = feignConfigurationAdapter.requestURLResolver;
        getDefaultHttpHeaders = feignConfigurationAdapter.getDefaultHttpHeaders;
    }

    return new _InnerFeignConfiguration()
};

const getApiModule = (configurer: FeignConfigurer): string => {
    if (configurer.apiModule == null) {
        return defaultApiModuleName;
    }
    return configurer.apiModule() || defaultApiModuleName;
}

export const feignConfigurationInitializer = (configurer: FeignConfigurer):
    Readonly<Pick<FeignConfiguration, "getRestTemplate" | "getHttpResponseEventListener">> => {
    const feignConfiguration = buildConfiguration(configurer);
    FeignConfigurationRegistry.setFeignConfiguration(getApiModule(configurer), feignConfiguration);
    return {
        getRestTemplate: feignConfiguration.getRestTemplate,
        getHttpResponseEventListener: feignConfiguration.getHttpResponseEventListener,
    };
};
