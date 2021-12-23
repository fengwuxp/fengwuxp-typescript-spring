import {HttpResponseEventPublisher, SmartHttpResponseEventListener} from "../event/HttpResponseEvent";
import {RequestURLResolver} from "../resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "../signature/ApiSignatureStrategy";
import {AuthenticationStrategy} from "../client/AuthenticationStrategy";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {FeignRequestContextOptions} from "../FeignRequestOptions";
import {FeignLog4jFactory} from "../log/FeignLog4jFactory";

export interface BaseFeignClientConfiguration {

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