import {BaseFeignClientOptions, FeignClientMemberOptions, FeignProxyClient} from "../support/FeignProxyClient";
import {defaultApiModuleName, FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";
import {FeignClientBuilder, FeignClientBuilderInterface} from "../FeignClientBuilder";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {Reflection as Reflect} from "@abraham/reflection";
import {FeignHttpConfiguration} from "../configuration/FeignHttpConfiguration";
import {BaseFeignClientConfiguration} from "../support/BaseFeignClientConfiguration";


export type FeignConfigurationConstructor<C extends BaseFeignClientConfiguration = BaseFeignClientConfiguration> = { new(...args: any[]): C }

export interface FeignClientOptions<C extends BaseFeignClientConfiguration> extends BaseFeignClientOptions {


    /**
     * feign configuration
     */
    configuration?: FeignConfigurationConstructor<C>;
}


export enum FeignClientType {

    HTTP,

    WS
}


export const generateFeignClientAnnotation = <C extends BaseFeignClientConfiguration, T extends FeignProxyClient<C>>(clientType: FeignClientType) => {

    return (options: FeignClientOptions<C>): Function => {

        /**
         * 创建feign代理的实例
         * @param  {T} clazz
         */
        return (clazz: { new(...args: any[]): {} }): any => {

            /**
             * {@link FeignHttpConfiguration} 的实现类类型
             */
            const feignConfigurationConstructor = options.configuration;

            /**
             * 返回一个实现了FeignProxyClient接口的匿名类
             */
            return class extends clazz implements FeignProxyClient<C> {

                private readonly _serviceName: string;

                private readonly _feignOptions: FeignClientMemberOptions<C>;

                constructor() {
                    super();

                    const feignOptions: FeignClientMemberOptions<C> = {
                        apiModule: options.apiModule || defaultApiModuleName,
                        value: options.value,
                        url: options.url,
                        configuration: undefined
                    };

                    this._serviceName = feignOptions.value || clazz.name;
                    this._feignOptions = feignOptions;
                    // build feign client instance
                    const feignClientBuilder: FeignClientBuilder = FeignConfigurationRegistry.getFeignClientBuilder(clientType);
                    return invokeFunctionInterface<FeignClientBuilder, FeignClientBuilderInterface<this>>(feignClientBuilder).build(this);
                }

                readonly serviceName = () => {
                    return this._serviceName
                };

                readonly feignOptions = () => {
                    return this._feignOptions;
                };

                readonly feignConfiguration = async () => {
                    const apiModule = this.feignOptions().apiModule;
                    const feignConfiguration = feignConfigurationConstructor != null ?
                        new feignConfigurationConstructor() : await FeignConfigurationRegistry.getFeignConfiguration<C>(clientType, apiModule);

                    // TODO 某些情况下 feign configuration 未初始化
                    if (feignConfiguration == null) {
                        throw new Error("feign configuration is null or not register");
                    }
                    this._feignOptions.configuration = feignConfiguration;
                    return feignConfiguration;
                };

                /**
                 * 获取获取接口方法的配置
                 * @param serviceMethod  服务方法名称
                 */
                public getFeignMethodConfig = (serviceMethod: string): FeignClientMethodConfig => {
                    return getFeignClientMethodConfig(clazz, serviceMethod);
                };
            }
        }
    };
}

/**
 *
 * @param clazz          feign class
 * @param serviceMethodName  方法名称
 */
export const getFeignClientMethodConfig = (clazz, serviceMethodName: string) => {
    return Reflect.getMetadata(FEIGN_CLINE_META_KEY, clazz, serviceMethodName);
};
