import {FeignConfigurationAdapter} from "./configuration/FeignConfigurationAdapter";
import {AbstractFeignConfiguration} from "./configuration/AbstractFeignConfiguration";
import {AbstractBrowserFeignConfiguration} from "./configuration/AbstractBrowserFeignConfiguration";
import {FeignConfiguration, FeignConfigurationRegistry} from "fengwuxp-typescript-feign";

export enum RuntimeEnvironment {

    NODE_SERVER,

    BROWSER,

    REACT_NATIVE,

    WEEX,

    WE_CHAT_APPLETS,

    ALI_PAY_APPLETS,

    TARO,
}

export interface FeignConfigurationInitializer {

    init: (feignConfigurationAdapter: FeignConfigurationAdapter, runtimeEnvironment: RuntimeEnvironment) => void;
}

const getDefaultFeignConfiguration = (runtimeEnvironment: RuntimeEnvironment): FeignConfiguration => {

    if (runtimeEnvironment === RuntimeEnvironment.NODE_SERVER) {
    } else if (runtimeEnvironment === RuntimeEnvironment.BROWSER) {
        class BrowserFeignConfiguration extends AbstractBrowserFeignConfiguration {

            constructor() {
                super();
            }
        }

        return new BrowserFeignConfiguration();
    } else if (runtimeEnvironment == RuntimeEnvironment.TARO) {
        class TaroFeignConfiguration extends AbstractFeignConfiguration {
            getHttpAdapter: () => null;
        }

        return new TaroFeignConfiguration();
    } else {
        return null;
    }
};

const invokeFunction = <T extends Function>(func: T): T => {
    if (typeof func !== "function") {
        return function () {
        } as any;
    }
    return func
};

const feignConfigurationInitializer: FeignConfigurationInitializer = {

    init: function (feignConfigurationAdapter: FeignConfigurationAdapter, runtimeEnvironment: RuntimeEnvironment) {

        const defaultFeignConfiguration = getDefaultFeignConfiguration(runtimeEnvironment);

        FeignConfigurationRegistry.setDefaultFeignConfiguration({
            getApiSignatureStrategy: invokeFunction(defaultFeignConfiguration.getApiSignatureStrategy),
            getFeignClientBuilder: invokeFunction(defaultFeignConfiguration.getFeignClientBuilder),
            getFeignClientExecutor: invokeFunction(defaultFeignConfiguration.getFeignClientExecutor),
            getFeignClientExecutorInterceptors:invokeFunction(defaultFeignConfiguration.getFeignClientExecutorInterceptors),
            getHttpAdapter: () => {
                return invokeFunction(feignConfigurationAdapter.httpAdapter)(defaultFeignConfiguration.getHttpAdapter());
            },
            getHttpClient: () => {
                const httpClient = invokeFunction(defaultFeignConfiguration.getHttpClient)();
                httpClient.setInterceptors(
                    feignConfigurationAdapter.registryClientHttpRequestInterceptors(httpClient.getInterceptors() || [])
                );
                return httpClient;
            },
            getRequestHeaderResolver: invokeFunction(defaultFeignConfiguration.getRequestHeaderResolver),
            getRequestURLResolver: invokeFunction(defaultFeignConfiguration.getRequestURLResolver),
            getRestTemplate: invokeFunction(defaultFeignConfiguration.getRestTemplate)

        })
    }

};


