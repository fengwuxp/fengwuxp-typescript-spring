import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpClient} from "../client/HttpClient";
import {RestOperations} from "../template/RestOperations";
import {FeignClientBuilder} from "../FeignClientBuilder";
import {RequestURLResolver} from "../resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "../signature/ApiSignatureStrategy";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {FeignClientExecutor} from "../FeignClientExecutor";
import {FeignClient} from "../FeignClient";
import RestTemplate from "../template/RestTemplate";

/**
 * feign configuration
 * since the method of changing the interface is called every time, it is necessary to implement memory.
 */
export interface FeignConfiguration {


    getHttpAdapter: () => HttpAdapter;

    getHttpClient: () => HttpClient;

    getRestTemplate: () => RestOperations;

    getFeignClientExecutor: <T extends FeignProxyClient = FeignProxyClient>(client: T) => FeignClientExecutor;

    getFeignClientBuilder?: <T extends FeignProxyClient = FeignProxyClient>() => FeignClientBuilder<T>;

    getRequestURLResolver?: () => RequestURLResolver;

    getRequestHeaderResolver?: () => RequestHeaderResolver;

    getApiSignatureStrategy?: () => ApiSignatureStrategy;
}
