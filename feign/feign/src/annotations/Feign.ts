import {FeignConfiguration} from "../configuration/FeignConfiguration";
import {defaultApiModuleName, FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {FeignClientBuilder, FeignClientBuilderInterface} from "../FeignClientBuilder";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";
import "reflect-metadata";

export interface FeignOptions {

    /**
     * 所属的api模块
     * 通过api模块名称可以区分不同模块的配置，比如api入口地址等
     *
     * api module name
     * @see {@link ../constant/FeignConstVar.ts ==> defaultApiModuleName}
     */
    apiModule?: string;

    /**
     * 请求uri
     * 默认：类名
     * request uri，default use feign client class name
     * example: SystemServiceFeignClient ==> SystemService
     */
    value?: string;

    /**
     * 绝对URL或可解析的主机名（协议是可选的）
     * an absolute URL or resolvable hostname (the protocol is optional)
     */
    url?: string;

    /**
     * feign configuration
     */
    configuration?: FeignConfiguration[] | FeignConfiguration;

}


/**
 * Mark a class as feign　client
 * @param options
 * @constructor
 */
export const Feign = <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions): Function => {

    /**
     * 创建feign代理的实例
     * @param  {T} clazz
     */
    return (clazz: { new(...args: any[]): {} }): any => {

        /**
         * 返回一个实现了FeignProxyClient接口的匿名类
         */
        return class extends clazz implements FeignProxyClient {

            /**
             * 服务名称
             */
            readonly serviceName: string;


            /**
             * feign代理的相关配置
             */
            readonly feignOptions: FeignOptions;

            constructor() {
                super();

                const feignOptions: FeignOptions = {
                    apiModule: defaultApiModuleName,
                    ...options
                };
                const feignConfiguration: FeignConfiguration = getFeignConfiguration(feignOptions.configuration);
                if (feignConfiguration == null) {
                    throw new Error("feign configuration is null or not register");
                }
                feignOptions.configuration = feignConfiguration;
                const {getFeignClientBuilder} = feignConfiguration;

                const feignClientBuilder: FeignClientBuilder<FeignProxyClient> = getFeignClientBuilder ? getFeignClientBuilder<T>() : defaultFeignClientBuilder;

                this.serviceName = feignOptions.value || clazz.name;
                this.feignOptions = feignOptions;
                //build feign client instance
                return invokeFunctionInterface<FeignClientBuilder<FeignProxyClient>, FeignClientBuilderInterface<this>>(feignClientBuilder).build(this);
            }


            /**
             * 获取获取接口方法的配置
             * @param serviceMethod  服务方法名称
             */
            public getFeignMethodConfig = (serviceMethod: string): FeignClientMethodConfig => {

                return Reflect.getMetadata(FEIGN_CLINE_META_KEY, clazz, serviceMethod);
            };


        }
    }
};

const getFeignConfiguration = (configuration?: FeignConfiguration[] | FeignConfiguration): FeignConfiguration => {
    const defaultFeignConfiguration = FeignConfigurationRegistry.getDefaultFeignConfiguration();
    if (configuration == null) {
        return defaultFeignConfiguration;
    }
    if (Array.isArray(configuration)) {
        const isEmpty = configuration.filter(item => item != null).length === 0;
        if (isEmpty) {
            return defaultFeignConfiguration;
        }
        return configuration.reduce(((previousValue, currentValue) => {
            return {
                ...previousValue,
                ...currentValue
            };
        }), {}) as FeignConfiguration;
    }

    return configuration;
};
