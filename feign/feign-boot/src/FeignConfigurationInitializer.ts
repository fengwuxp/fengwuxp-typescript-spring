import {FeignConfigurationAdapter} from "./FeignConfigurationAdapter";
import {
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


const buildConfiguration = (feignConfigurationAdapter: FeignConfigurationAdapter) => {

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

export const feignConfigurationInitializer = (feignConfigurationAdapter: FeignConfigurationAdapter):
    Readonly<Pick<FeignConfiguration, "getRestTemplate" | "getHttpResponseEventListener">> => {
    const configuration = buildConfiguration(feignConfigurationAdapter);
    FeignConfigurationRegistry.setDefaultFeignConfiguration(configuration);
    return {
        getRestTemplate: configuration.getRestTemplate,
        getHttpResponseEventListener: configuration.getHttpResponseEventListener,
    };
};
