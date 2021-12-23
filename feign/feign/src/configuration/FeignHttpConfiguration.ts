import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpClient} from "../client/HttpClient";
import {RestOperations} from "../template/RestOperations";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {FeignClientExecutor} from "../FeignClientExecutor";
import {HttpRequest} from "../client/HttpRequest";
import {BaseFeignClientConfiguration} from "../support/BaseFeignClientConfiguration";

/**
 * feign http configuration
 * since the method of changing the interface is called every time, it is necessary to implement memory.
 */
export interface FeignHttpConfiguration extends BaseFeignClientConfiguration {

    /**
     * get http adapter
     */
    getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    /**
     * get http client
     */
    getHttpClient: <T extends HttpRequest = HttpRequest> () => HttpClient;

    getRestTemplate: () => RestOperations;

    getFeignClientExecutor: <T extends FeignProxyClient<FeignHttpConfiguration> = FeignProxyClient<FeignHttpConfiguration>>(client: T) => FeignClientExecutor;
}



