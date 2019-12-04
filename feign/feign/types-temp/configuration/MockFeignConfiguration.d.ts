import { FeignConfiguration } from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import { FeignProxyClient } from "../support/FeignProxyClient";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import MockHttpAdapter from "../adapter/mock/MockHttpAdapter";
import { HttpRequest } from "../client/HttpRequest";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
/**
 * mock feign configuration
 */
export declare class MockFeignConfiguration implements FeignConfiguration {
    private baseUrl;
    constructor(baseUrl: string);
    getFeignClientExecutor: <T extends FeignProxyClient = FeignProxyClient>(client: T) => DefaultFeignClientExecutor<T>;
    getHttpAdapter: () => MockHttpAdapter;
    getHttpClient: <T extends HttpRequest = HttpRequest>() => DefaultHttpClient<HttpRequest>;
    getRestTemplate: () => RestTemplate;
    getFeignClientExecutorInterceptors: () => FeignClientExecutorInterceptor<import("../FeignRequestOptions").FeignRequestBaseOptions>[];
}
