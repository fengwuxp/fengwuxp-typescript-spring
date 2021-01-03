import {FeignClient} from "../FeignClient";
import {FeignMemberOptions} from "../annotations/Feign";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";
import {FeignConfiguration} from "..";

/**
 * feign proxy client
 */
export interface FeignProxyClient extends FeignClient {


    /**
     * service name or access path
     */
    readonly serviceName: () => string;

    /**
     * feign proxy options
     */
    readonly feignOptions: () => Readonly<FeignMemberOptions>;

    /**
     * get feign configuration
     */
    readonly feignConfiguration: () => Promise<Readonly<FeignConfiguration>> | Readonly<FeignConfiguration>;

    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => Readonly<FeignClientMethodConfig>;

}
