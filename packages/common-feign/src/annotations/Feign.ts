import {FeignConfiguration} from "../configuration/FeignConfiguration";
import {defaultApiModuleName, FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {FeignClientBuilder, FeignClientBuilderFunction, FeignClientBuilderInterface} from "../FeignClientBuilder";
import {defaultFeignClientBuilder} from "../DefaultFeignClientBuilder";
import "reflect-metadata";

export interface FeignOptions {

    /**
     * 所属的api模块
     * default 默认模块
     * 通过api模块名称可以区分不同模块的配置，比如api入口地址等
     */
    apiModule?: string;

    /**
     * 请求uri
     * 默认：类名
     */
    value?: string;

    /**
     * 绝对URL或可解析的主机名（协议是可选的）
     * an absolute URL or resolvable hostname (the protocol is optional)
     */
    url?: string;

    /**
     * 配置
     */
    configuration?: FeignConfiguration[];

}


/**
 * 标记一个类为 feign　client
 * @param options
 * @constructor
 */
export const Feign = <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions): Function => {

    const defaultFeignConfiguration = FeignConfigurationRegistry.getDefaultFeignConfiguration();

    const feignOptions: FeignOptions = {
        apiModule: defaultApiModuleName,
        configuration: [defaultFeignConfiguration],
        ...options
    };

    const feignConfiguration = feignOptions.configuration[0];

    /**
     * 创建feign代理的实例
     * @param  {T} clazz
     */
    return (clazz: { new(...args: any[]): {} }): any => {
        if (feignConfiguration == null) {
            throw new Error("feign configuration is null");
        }

        const {getFeignClientBuilder} = feignConfiguration;

        const feignClientBuilder: FeignClientBuilder<FeignProxyClient> = getFeignClientBuilder ? getFeignClientBuilder<T>() : defaultFeignClientBuilder;

        /**
         * 返回一个实现了FeignProxyClient接口的匿名类
         */
        return class extends clazz implements FeignProxyClient {


            constructor() {
                super();
                //build feign client instance
                return invokeFunctionInterface<FeignClientBuilder<FeignProxyClient>, FeignClientBuilderInterface<this>>(feignClientBuilder).build(this);
            }

            serviceName: string = feignOptions.value || clazz.name;


            /**
             * feign代理的相关配置
             */
            feignOptions: FeignOptions = feignOptions;


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
