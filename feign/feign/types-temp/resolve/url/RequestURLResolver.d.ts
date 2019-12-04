import { FeignProxyClient } from "../../support/FeignProxyClient";
/**
 * 解析url
 * @param apiService  接口服务
 * @param methodName  服务方法名称
 */
export declare type RequestURLResolver = (apiService: FeignProxyClient, methodName: string) => string;
