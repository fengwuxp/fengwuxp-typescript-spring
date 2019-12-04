import { HttpRequest } from "../client/HttpRequest";
import { ClientHttpRequestInterceptorInterface } from "../client/ClientHttpRequestInterceptor";
import { NetworkStatusListener } from "./NetworkStatusListener";
import { NoneNetworkFailBack } from "./NoneNetworkFailBack";
/**
 * It needs to be configured first in the {@see ClientHttpRequestInterceptorInterface} list
 *
 * Check whether the client network is available and can be degraded with custom processing.
 * For example, stack requests until the network is available or abandon the request
 *
 * Network interception interceptor during the execution of http client, which conflicts with {@see NetworkFeignClientExecutorInterceptor}
 */
export default class NetworkClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    private networkStatusListener;
    private noneNetworkHandler;
    private networkStatus;
    private tryWaitNetworkCount;
    private spinWaitMaxTimes;
    constructor(networkStatusListener: NetworkStatusListener, noneNetworkHandler?: NoneNetworkFailBack<T>, tryWaitNetworkCount?: number, spinWaitMaxTimes?: number);
    interceptor: (req: T) => Promise<T>;
    private initNetwork;
    private handleFailBack;
    /**
     * try spin wait network
     */
    private trySpinWait;
}
