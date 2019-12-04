import { FeignConfiguration } from "../configuration/FeignConfiguration";
import { FeignProxyClient } from "../support/FeignProxyClient";
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
export declare const Feign: <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions) => Function;
