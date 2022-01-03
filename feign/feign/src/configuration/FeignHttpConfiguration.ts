import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpClient} from "../client/HttpClient";
import {RestOperations} from "../template/RestOperations";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {FeignClientExecutor} from "../FeignClientExecutor";
import {HttpRequest} from "../client/HttpRequest";
import {BaseFeignClientConfiguration} from "../support/BaseFeignClientConfiguration";
import {HttpResponseEventPublisher, SmartHttpResponseEventListener} from "../event/HttpResponseEvent";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";

/**
 * feign http configuration
 * since the method of changing the interface is called every time, it is necessary to implement memory.
 */
export interface FeignHttpConfiguration extends BaseFeignClientConfiguration {

    getHttpResponseEventPublisher: () => HttpResponseEventPublisher;

    getHttpResponseEventListener: () => SmartHttpResponseEventListener;

    getFeignClientExecutorInterceptors: () => FeignClientExecutorInterceptor[];

    /**
     * get default request headers
     */
    getDefaultHttpHeaders?: () => Record<string, string>

    /**
     * get http adapter
     */
    getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    /**
     * get http client
     */
    getHttpClient: <T extends HttpRequest = HttpRequest> () => HttpClient;

    getRestTemplate: () => RestOperations;

}



