import { HttpMethod, ClientHttpRequestInterceptor, MappedClientHttpRequestInterceptor, HttpRequest, FeignClientExecutorInterceptor, MappedFeignClientExecutorInterceptor, FeignRequestBaseOptions, HttpAdapter, HttpMediaType, ApiSignatureStrategy, FeignUIToast } from 'fengwuxp-typescript-feign';

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

interface InterceptorRegistry {
    addInterceptor: (interceptor: any) => InterceptorRegistration;
    getInterceptors: () => any[];
}

/**
 * client http interceptor registration
 */
declare class ClientHttpInterceptorRegistration extends InterceptorRegistration {
    constructor(clientInterceptor: ClientHttpRequestInterceptor);
    getInterceptor: () => MappedClientHttpRequestInterceptor<HttpRequest>;
}

declare class ClientHttpInterceptorRegistry implements InterceptorRegistry {
    private clientHttpInterceptorRegistrations;
    addInterceptor: (interceptor: ClientHttpRequestInterceptor<HttpRequest>) => ClientHttpInterceptorRegistration;
    getInterceptors: () => any[];
}

declare class FeignClientExecutorInterceptorRegistration extends InterceptorRegistration {
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor);
    getInterceptor: () => MappedFeignClientExecutorInterceptor<FeignRequestBaseOptions>;
}

declare class FeignClientInterceptorRegistry implements InterceptorRegistry {
    private feignClientExecutorInterceptorRegistrations;
    addInterceptor: (interceptor: FeignClientExecutorInterceptor<FeignRequestBaseOptions>) => FeignClientExecutorInterceptorRegistration;
    getInterceptors: () => any[];
}

interface FeignConfigurationAdapter {
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
     * feign ui toast
     */
    feignUIToast?: () => FeignUIToast;
}

declare const feignConfigurationInitializer: (feignConfigurationAdapter: FeignConfigurationAdapter) => void;

export { ClientHttpInterceptorRegistration, ClientHttpInterceptorRegistry, FeignClientExecutorInterceptorRegistration, FeignClientInterceptorRegistry, FeignConfigurationAdapter, InterceptorRegistration, InterceptorRegistry, feignConfigurationInitializer };
