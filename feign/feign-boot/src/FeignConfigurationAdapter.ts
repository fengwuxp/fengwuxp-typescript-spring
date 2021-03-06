import {
    ApiSignatureStrategy,
    HttpAdapter,
    HttpMediaType,
    HttpRequest,
    FeignUIToast,
    RequestURLResolver,
    AuthenticationBroadcaster,
    AuthenticationStrategy, BusinessResponseExtractorFunction
} from "fengwuxp-typescript-feign";
import ClientHttpInterceptorRegistry from "./registry/ClientHttpInterceptorRegistry";
import FeignClientInterceptorRegistry from "./registry/FeignClientInterceptorRegistry";


export interface FeignConfigurationAdapter {


    /**
     * get http adapter
     */
    httpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;


    /**
     * default request content-type value
     * default value: application/x-www-form-urlencoded
     */
    defaultProduce: () => HttpMediaType


    /**
     * registry client http request interceptors
     * @param registry
     * @return  new interceptors
     */
    registryClientHttpRequestInterceptors?: (registry: ClientHttpInterceptorRegistry) => void;

    /**
     * registry feign client executor interceptors
     * @param registry
     * @return  new interceptors
     */
    registryFeignClientExecutorInterceptors?: (registry: FeignClientInterceptorRegistry) => void;

    /**
     * api signature
     */
    apiSignatureStrategy?: () => ApiSignatureStrategy;

    authenticationStrategy?: () => AuthenticationStrategy;

    authenticationBroadcaster?: () => AuthenticationBroadcaster;

    /**
     * url 解析策略
     * default restfulRequestURLResolver
     *
     * @see restfulRequestURLResolver
     */
    requestURLResolver?: () => RequestURLResolver;

    /**
     * feign ui toast
     * {@link FeignUIToast}
     */
    feignUIToast?: () => FeignUIToast;

    /**
     * get default request headers
     */
    getDefaultHttpHeaders?: () => Record<string, string>;

    /**
     * get {@link BusinessResponseExtractorFunction}
     */
    getBusinessResponseExtractor?: () => BusinessResponseExtractorFunction;

}
