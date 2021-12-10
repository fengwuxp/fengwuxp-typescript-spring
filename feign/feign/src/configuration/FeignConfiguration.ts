import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpClient} from "../client/HttpClient";
import {RestOperations} from "../template/RestOperations";
import {RequestURLResolver} from "../resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "../signature/ApiSignatureStrategy";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {FeignClientExecutor} from "../FeignClientExecutor";
import {HttpRequest} from "../client/HttpRequest";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {FeignRequestContextOptions} from '../FeignRequestOptions';
import {AuthenticationStrategy} from '../client/AuthenticationStrategy';
import {HttpResponseEventPublisher, SmartHttpResponseEventListener} from "../event/HttpResponseEvent";
import {Log4jLogger} from "../log/Log4jLogger";
import {FeignLog4jFactory} from "../log/FeignLog4jFactory";

/**
 * feign configuration
 * since the method of changing the interface is called every time, it is necessary to implement memory.
 */
export interface FeignConfiguration {

    /**
     * get http adapter
     */
    getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    /**
     * get http client
     */
    getHttpClient: <T extends HttpRequest = HttpRequest> () => HttpClient;

    getRestTemplate: () => RestOperations;

    getFeignClientExecutor: <T extends FeignProxyClient = FeignProxyClient>(client: T) => FeignClientExecutor;

    getHttpResponseEventPublisher: () => HttpResponseEventPublisher;

    getHttpResponseEventListener: () => SmartHttpResponseEventListener;

    getRequestURLResolver?: () => RequestURLResolver;

    getRequestHeaderResolver?: () => RequestHeaderResolver;

    getApiSignatureStrategy?: () => ApiSignatureStrategy;

    getAuthenticationStrategy?: () => AuthenticationStrategy;

    getFeignClientExecutorInterceptors?: () => FeignClientExecutorInterceptor[];

    /**
     * get default feign request context options
     */
    getDefaultFeignRequestContextOptions?: () => FeignRequestContextOptions;

    /**
     * get default request headers
     */
    getDefaultHttpHeaders?: () => Record<string, string>

    /**
     * log4j support
     */
    getLog4jFactory?: () => FeignLog4jFactory;
}


export type FeignConfigurationConstructor = { new(...args: any[]): FeignConfiguration }
