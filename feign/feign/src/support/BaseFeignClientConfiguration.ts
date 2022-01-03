import {RequestURLResolver} from "../resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "../signature/ApiSignatureStrategy";
import {AuthenticationStrategy} from "../client/AuthenticationStrategy";
import {FeignRequestContextOptions} from "../FeignRequestOptions";
import {FeignLog4jFactory} from "../log/FeignLog4jFactory";
import {FeignProxyClient} from "./FeignProxyClient";
import {FeignClientExecutor} from "../FeignClientExecutor";

export interface BaseFeignClientConfiguration {

    getRequestURLResolver?: () => RequestURLResolver;

    getRequestHeaderResolver?: () => RequestHeaderResolver;

    getApiSignatureStrategy?: () => ApiSignatureStrategy;

    getAuthenticationStrategy?: () => AuthenticationStrategy;

    /**
     * get default feign request context options
     */
    getDefaultFeignRequestContextOptions?: () => FeignRequestContextOptions;


    /**
     * log4j support
     */
    getLog4jFactory?: () => FeignLog4jFactory;


}