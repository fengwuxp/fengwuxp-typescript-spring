import {FeignClient} from "../FeignClient";
import {FeignOptions} from "../annotations/Feign";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";


export interface FeignProxyClient extends FeignClient{

    /**
     * 服务方法的名称或者是访问路径
     */
    serviceName: string;

    /**
     * feign的代理配置
     */
    feignOptions: FeignOptions;

    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => FeignClientMethodConfig;

    /**
     * 设置服务方法的配置config
     * @param serviceMethodName
     * @param config
     */
    setFeignMethodConfig: (serviceMethodName: string, config: FeignClientMethodConfig) => void;
}
