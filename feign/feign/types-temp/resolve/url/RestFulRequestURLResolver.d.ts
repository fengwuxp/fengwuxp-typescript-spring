import { RequestURLResolver } from "./RequestURLResolver";
import { FeignOptions } from "../../annotations/Feign";
import { FeignProxyClient } from "../../support/FeignProxyClient";
/**
 * restful requet url resolver
 * @param apiService
 * @param methodName
 */
export declare const restfulRequestURLResolver: RequestURLResolver;
/**
 * 通过ApiService 生成uri
 * @param apiService
 * @param feignOptions
 */
export declare const getApiUriByApiService: (apiService: FeignProxyClient, feignOptions: FeignOptions) => string;
