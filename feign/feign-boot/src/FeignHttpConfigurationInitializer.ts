import {FeignHttpConfigurer} from "./FeignHttpConfigurer";
import {
    FeignClientType,
    defaultApiModuleName,
    DefaultFeignClientExecutor,
    DefaultFeignLog4jFactory,
    DefaultHttpClient,
    FeignConfigurationRegistry,
    FeignHttpConfiguration,
    FeignProxyClient,
    HttpResponseEventPublisher,
    Log4jLevel,
    RestTemplate,
    SimpleHttpResponseEventListener,
    SimpleHttpResponseEventPublisher,
    SmartHttpResponseEventListener
} from "fengwuxp-typescript-feign";
import FeignClientInterceptorRegistry from "./registry/FeignClientInterceptorRegistry";
import ClientHttpInterceptorRegistry from "./registry/ClientHttpInterceptorRegistry";


const buildConfiguration = (feignConfigurationAdapter: FeignHttpConfigurer) => {

    const httpResponseEventListener = new SimpleHttpResponseEventListener();
    const httpResponseEventPublisher = new SimpleHttpResponseEventPublisher(httpResponseEventListener);

    class _InnerFeignConfiguration implements FeignHttpConfiguration {

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
        getDefaultFeignRequestContextOptions = feignConfigurationAdapter.getDefaultFeignRequestContextOptions;
    }

    return new _InnerFeignConfiguration()
};

const getApiModule = (configurer: FeignHttpConfigurer): string => {
    if (configurer.apiModule == null) {
        return defaultApiModuleName;
    }
    return configurer.apiModule() || defaultApiModuleName;
}

/**
 * feign 配置初始化
 * @param configurer
 */
export const feignHttpConfigurationInitialize = (configurer: FeignHttpConfigurer):
    Readonly<Pick<FeignHttpConfiguration, "getRestTemplate" | "getHttpResponseEventListener"> & { setLoggerLevel: (level: Log4jLevel) => void }> => {
    const feignConfiguration = buildConfiguration(configurer);
    FeignConfigurationRegistry.setFeignConfiguration(FeignClientType.HTTP, getApiModule(configurer), feignConfiguration);
    return {
        getRestTemplate: feignConfiguration.getRestTemplate,
        getHttpResponseEventListener: feignConfiguration.getHttpResponseEventListener,
        setLoggerLevel: (level: Log4jLevel) => DefaultFeignLog4jFactory.getRootLogger().level = level,
    };
};
