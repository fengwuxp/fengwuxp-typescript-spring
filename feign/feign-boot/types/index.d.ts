import { HttpMethod, ClientHttpRequestInterceptor, MappedClientHttpRequestInterceptor, FeignClientExecutorInterceptor, MappedFeignClientExecutorInterceptor, HttpRequest, HttpAdapter, HttpMediaType, ApiSignatureStrategy, AuthenticationStrategy, RequestURLResolver, BusinessResponseExtractorFunction, FeignConfiguration } from 'fengwuxp-typescript-feign';

/**
 * Get one through {@link InterceptorRegistration#getInterceptor} mapping interceptor
 * {@link MappedClientHttpRequestInterceptor}
 */
declare abstract class InterceptorRegistration {
    protected includePatterns: string[];
    protected excludePatterns: string[];
    protected includeMethods: HttpMethod[];
    protected excludeMethods: HttpMethod[];
    protected includeHeaders: string[][];
    protected excludeHeaders: string[][];
    protected interceptor: any;
    constructor(interceptor: any);
    addPathPatterns: (...patterns: string[]) => this;
    excludePathPatterns: (...patterns: string[]) => this;
    addHttpMethods: (...methods: HttpMethod[]) => this;
    excludeHttpMethods: (...methods: HttpMethod[]) => this;
    /**
     * @param headers  example: ["header name","header value"]  header value If it exists, it will be compared
     */
    addHeadersPatterns: (...headers: string[][]) => this;
    excludeHeadersPatterns: (...headers: string[][]) => this;
    abstract getInterceptor: () => any;
}

/**
 * interceptor registry
 * {@link InterceptorRegistration}
 */
interface InterceptorRegistry {
    addInterceptor: (interceptor: any) => InterceptorRegistration;
    getInterceptors: () => any[];
}

/**
 * client http interceptor registration
 */
declare class ClientHttpInterceptorRegistration extends InterceptorRegistration {
    constructor(clientInterceptor: ClientHttpRequestInterceptor);
    getInterceptor: () => MappedClientHttpRequestInterceptor;
}

declare class ClientHttpInterceptorRegistry implements InterceptorRegistry {
    private clientHttpInterceptorRegistrations;
    addInterceptor: (interceptor: ClientHttpRequestInterceptor) => ClientHttpInterceptorRegistration;
    getInterceptors: () => any[];
}

declare class FeignClientExecutorInterceptorRegistration extends InterceptorRegistration {
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor);
    getInterceptor: () => MappedFeignClientExecutorInterceptor;
}

declare class FeignClientInterceptorRegistry implements InterceptorRegistry {
    private feignClientExecutorInterceptorRegistrations;
    addInterceptor: (interceptor: FeignClientExecutorInterceptor) => FeignClientExecutorInterceptorRegistration;
    getInterceptors: () => any[];
}

interface FeignConfigurer {
    /**
     * 配置支持的 api 模块
     * 默认：default
     */
    apiModule?: () => string;
    /**
     * get http adapter
     */
    httpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;
    /**
     * default request content-type value
     * default value: application/x-www-form-urlencoded
     */
    defaultProduce: () => HttpMediaType;
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
    /**
     * 认证策略
     */
    authenticationStrategy?: () => AuthenticationStrategy;
    /**
     * url 解析策略
     * default restfulRequestURLResolver
     *
     * @see restfulRequestURLResolver
     */
    requestURLResolver?: () => RequestURLResolver;
    /**
     * get default request headers
     */
    getDefaultHttpHeaders?: () => Record<string, string>;
    /**
     * get {@link BusinessResponseExtractorFunction}
     */
    getBusinessResponseExtractor?: () => BusinessResponseExtractorFunction;
}

/**
 * feign 配置初始化
 * @param configurer
 */
declare const feignConfigurationInitialize: (configurer: FeignConfigurer) => Readonly<Pick<FeignConfiguration, "getRestTemplate" | "getHttpResponseEventListener">>;

export { ClientHttpInterceptorRegistration, ClientHttpInterceptorRegistry, FeignClientExecutorInterceptorRegistration, FeignClientInterceptorRegistry, FeignConfigurer, InterceptorRegistration, InterceptorRegistry, feignConfigurationInitialize };
