import {FeignConfiguration, FeignConfigurationConstructor} from "../configuration/FeignConfiguration";
import {defaultApiModuleName, FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {FeignClientBuilder, FeignClientBuilderInterface} from "../FeignClientBuilder";
import Reflect from "../ReflectMetadata";


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
    configuration?: FeignConfigurationConstructor;

}

export interface FeignMemberOptions extends Pick<FeignOptions, Exclude<keyof FeignOptions, "configuration">> {

    /**
     * feign configuration
     */
    configuration?: FeignConfiguration;
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
         * {@link FeignConfiguration} 的实现类类型
         */
        const feignConfigurationConstructor = options.configuration;

        /**
         * 返回一个实现了FeignProxyClient接口的匿名类
         */
        return class extends clazz implements FeignProxyClient {

            private readonly _serviceName: string;

            private readonly _feignOptions: FeignMemberOptions;

            constructor() {
                super();

                const feignOptions: FeignMemberOptions = {
                    apiModule: options.apiModule || defaultApiModuleName,
                    value: options.value,
                    url: options.url,
                    configuration: undefined
                };

                this._serviceName = feignOptions.value || clazz.name;
                this._feignOptions = feignOptions;
                //build feign client instance
                const feignClientBuilder: FeignClientBuilder = FeignConfigurationRegistry.getFeignClientBuilder();
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
                const feignConfiguration: FeignConfiguration = feignConfigurationConstructor != null ?
                    new feignConfigurationConstructor() : await FeignConfigurationRegistry.getFeignConfiguration(apiModule);

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

/**
 *
 * @param clazz          feign class
 * @param serviceMethodName  方法名称
 */
export const getFeignClientMethodConfig = (clazz, serviceMethodName: string) => {
    return Reflect.getMetadata(FEIGN_CLINE_META_KEY, clazz, serviceMethodName);
};
