import NetworkClientHttpRequestInterceptor from "./NetworkClientHttpRequestInterceptor";
import { FeignRequestOptions } from "../FeignRequestOptions";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
import { HttpResponse } from "../client/HttpResponse";
import { NetworkStatusListener } from "./NetworkStatusListener";
import { NoneNetworkFailBack } from "./NoneNetworkFailBack";
import { HttpRequest } from "..";
/**
 * It needs to be configured first in the {@see FeignClientExecutorInterceptor} list
 *
 * Network interception interceptor during the execution of feign client, which conflicts with {@see NetworkClientHttpRequestInterceptor}
 */
export default class NetworkFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> extends NetworkClientHttpRequestInterceptor<any> implements FeignClientExecutorInterceptor<T> {
    constructor(networkStatusListener: NetworkStatusListener, noneNetworkHandler?: NoneNetworkFailBack<HttpRequest>, tryWaitNetworkCount?: number, spinWaitMaxTimes?: number);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => E;
    preHandle: <T_1>(options: T_1) => Promise<any>;
}
