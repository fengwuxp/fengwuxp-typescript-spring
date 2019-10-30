import {FeignClient} from "../FeignClient";
import {FeignOptions} from "../annotations/Feign";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";

/**
 * feign proxy client
 */
export interface FeignProxyClient extends FeignClient {


    /**
     * 服务方法的名称或者是访问路径
     */
    readonly  serviceName: string;

    /**
     * feign的代理配置
     */
    readonly  feignOptions: FeignOptions;

    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => FeignClientMethodConfig;


}
