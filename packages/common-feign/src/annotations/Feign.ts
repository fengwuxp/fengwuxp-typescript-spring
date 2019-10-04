import {FeignConfiguration} from "../configuration/FeignConfiguration";
import {FeignClient} from "../FeignClient";
import {defaultApiModuleName} from "../constant/FeignConstVar";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {newProxyInstance} from "../../../common-proxy/src";
import {ProxyScope} from "../../../common-proxy/src/ProxyScope";
import {FeignProxyClient} from "../support/FeignProxyClient";

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
 * ignore property and method
 */
const ignorePropertyNames: string[] = [
    "getFeignMethodConfig",
    "setFeignMethodConfig"
];

/**
 * 标记一个类为 feign　client
 * @param options
 * @constructor
 */
export const Feign = <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions): any => {

    const defaultFeignConfiguration = FeignConfigurationRegistry.getDefaultFeignConfiguration();

    const feignOptions: FeignOptions = {
        apiModule: defaultApiModuleName,
        configuration: [defaultFeignConfiguration],
        ...(options || {})
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

        /**
         * 返回一个实现了FeignProxy接口的匿名类
         */
        return class extends clazz implements FeignProxyClient {


            constructor() {
                super();
                //build feign client instance
                return newProxyInstance(
                    this, (target: T, serviceMethod: string, receiver: any) => {
                        return (...args) => {
                            // Different proxy service executors can be returned according to different strategies
                            return getFeignClientBuilder().build().execute(target, serviceMethod,...args);
                        };
                    }, null,
                    ProxyScope.METHOD,
                    (object, key) => {
                        const isIgnore = ignorePropertyNames.some((item) => item === key);
                        return !isIgnore;
                    }
                );
            }

            serviceName: string = feignOptions.value || clazz.name;


            /**
             * feign代理的相关配置
             */
            feignOptions: FeignOptions = feignOptions;

            /**
             * 接口方法配置列表
             * key 接口方法名称
             * value 接口方法配置
             */
            protected configs: Map<string, FeignClientMethodConfig> = new Map<string, FeignClientMethodConfig>();


            /**
             * 获取获取接口方法的配置
             * @param serviceMethod  服务方法名称
             */
            public getFeignMethodConfig = (serviceMethod: string): FeignClientMethodConfig => {

                return this.configs.get(serviceMethod) || {};
            };

            /**
             * 设置服务方法的配置config
             * @param serviceMethodName
             * @param config
             */
            public setFeignMethodConfig = (serviceMethodName: string, config: FeignClientMethodConfig) => {
                this.configs.set(serviceMethodName, config);
            };


        }
    }
};
