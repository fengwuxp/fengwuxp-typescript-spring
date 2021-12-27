import {FeignClient} from "../FeignClient";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";
import {BaseFeignClientConfiguration} from "./BaseFeignClientConfiguration";


export interface BaseFeignClientOptions {

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
}

export interface FeignClientMemberOptions<C extends BaseFeignClientConfiguration = BaseFeignClientConfiguration> extends BaseFeignClientOptions {

    /**
     * feign configuration
     */
    configuration?: C;
}

/**
 * feign proxy client
 */
export interface FeignProxyClient<C extends BaseFeignClientConfiguration = BaseFeignClientConfiguration> extends FeignClient {


    /**
     * service name or access path
     */
    readonly serviceName: () => string;

    /**
     * feign proxy options
     */
    readonly feignOptions: () => Readonly<FeignClientMemberOptions<C>>;

    /**
     * get feign configuration
     */
    readonly feignConfiguration: <C>() => Promise<Readonly<C>>;

    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => Readonly<FeignClientMethodConfig>;

}
