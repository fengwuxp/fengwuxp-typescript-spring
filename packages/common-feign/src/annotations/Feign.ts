import {FeignConfiguration} from "../configuration/FeignConfiguration";


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
export const FeignClient = (options: FeignOptions): any => {

};
