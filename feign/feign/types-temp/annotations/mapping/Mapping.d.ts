import { HttpMethod } from "../../constant/http/HttpMethod";
export interface BaseRequestMappingOptions {
    /**
     * 请求的uri地址
     * 支持path variable 例如：getMember/{memberId}，表明参数中的memberId将作为路径参数，命名要保持一致
     */
    value?: string;
    /**
     * 自定义请求头，支持2中写法
     * 1：固定值，例如 {myHeader:"1234"}
     * 2：将参数中的某些字段当做请求头，例如：{token:"{token}"}
     */
    headers?: Record<string, string>;
    /**
     * 超时时间，
     * 单位：毫秒
     * 默认 10 * 1000 毫秒
     */
    timeout?: number;
    /**
     * 提交的数据类型
     * @see {@link ../constant/http/MediaType}
     * 默认 MediaType.JSON_UTF8
     */
    consumes?: string[];
    /**
     * 响应的数据类型
     * @see {@link ../constant/http/MediaType}
     * 默认 MediaType.JSON_UTF8
     */
    produces?: string[];
    /**
     * 需要鉴权
     * 默认：false
     */
    needAuth?: boolean;
}
export interface RequestMappingOptions extends BaseRequestMappingOptions {
    /**
     * 请求 method
     */
    method: HttpMethod;
}
export declare type Mapping<T extends BaseRequestMappingOptions = BaseRequestMappingOptions> = (options: T) => Function;
/**
 * 生成Mapping注解 的方法
 * @param method
 */
export declare function generateMapping<T extends BaseRequestMappingOptions>(method?: HttpMethod): Mapping<T>;
