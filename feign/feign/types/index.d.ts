/// <reference types="node" />
import { DateFormatType } from 'fengwuxp-common-utils/lib/date/DateFormatUtils';
import { PathMatcher } from 'fengwuxp-common-utils/src/match/PathMatcher';
import { ParsedUrlQueryInput } from 'querystring';

/**
 * http request method
 */
declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    HEAD = "HEAD",
    TRACE = "TRACE",
    OPTIONS = "OPTIONS",
    CONNECT = "CONNECT"
}

interface HttpRequest {
    /**
     * 请求url
     */
    url: string;
    /**
     * request body
     */
    body?: any;
    /**
     * http request method
     *  @see {@link /src/constant/http/HttpMethod}
     */
    method: HttpMethod | string;
    /**
     * request data
     */
    headers?: Record<string, string>;
    /**
     * request time out times
     * default: 10 * 1000 ms
     */
    timeout?: number;
}

/**
 * http request response
 */
interface HttpResponse<T = any> {
    /**
     * http status code
     */
    statusCode: number;
    /**
     * http status text
     */
    statusText?: string;
    /**
     * request is success
     */
    ok: boolean;
    /**
     * response data
     */
    data: T;
    /**
     * http response headers
     */
    headers?: Record<string, string>;
}

/**
 * http request adapter
 *
 * different http clients can be implemented according to different java script runtime environments.
 */
interface HttpAdapter<T extends HttpRequest = HttpRequest> {
    /**
     * send an http request to a remote server
     * @param req
     */
    send: (req: T) => Promise<HttpResponse>;
}

interface BaseRequestMappingOptions {
    /**
     * 请求的uri地址
     * 支持path variable 例如：getMember/{memberId}，表明参数中的memberId将作为路径参数，命名要保持一致
     */
    value?: string;
    /**
     * 自定义请求头，支持2中写法
     * 1：固定值，例如 {myHeader:"1234"}
     * 2：将参数中的某些字段当做请求头，例如：{token:"{token}"}
     */
    headers?: Record<string, string>;
    /**
     * 超时时间，
     * 单位：毫秒
     * 默认 10 * 1000 毫秒
     */
    timeout?: number;
    /**
     * 提交的数据类型
     * @see {@link ../constant/http/MediaType}
     * 默认 MediaType.JSON_UTF8
     */
    consumes?: string[];
    /**
     * 响应的数据类型
     * @see {@link ../constant/http/MediaType}
     * 默认 MediaType.JSON_UTF8
     */
    produces?: string[];
    /**
     * 需要鉴权
     * 默认：false
     */
    needAuth?: boolean;
}
interface RequestMappingOptions extends BaseRequestMappingOptions {
    /**
     * 请求 method
     */
    method: HttpMethod;
}
declare type Mapping<T extends BaseRequestMappingOptions = BaseRequestMappingOptions> = (options: T) => Function;

declare const RequestMapping: Mapping<RequestMappingOptions>;

/**
 * PostMapping
 */
declare const PostMapping: Mapping<BaseRequestMappingOptions>;

/**
 * PatchMapping
 */
declare const PatchMapping: Mapping<BaseRequestMappingOptions>;

/**
 * PutMapping
 */
declare const PutMapping: Mapping<BaseRequestMappingOptions>;

/**
 * DeleteMapping
 */
declare const DeleteMapping: Mapping<BaseRequestMappingOptions>;

/**
 *  Tag interface
 *  feign client
 */
interface FeignClient {
}

interface DataObfuscationOptions {
    /**
     * 请求数据中需要混淆的数据
     */
    requestFields?: string[];
    /**
     * 响应数据中被混淆的数据
     */
    responseFields?: string[];
}
/**
 * @param options 数据混淆
 * @constructor
 */
declare const DataObfuscation: <T extends FeignClient>(options: DataObfuscationOptions) => Function;

/**
 * 签名配置
 */
interface SignatureOptions {
    /**
     * 要签名的字段名称
     */
    fields: Array<string>;
}
/**
 * @param options 签名配置
 * @constructor
 */
declare const Signature: <T extends FeignClient>(options: SignatureOptions) => Function;

/**
 * 需要自动上传配置
 */
interface AutoFileUploadOptions {
    /**
     * 需要执行上传动作的字段
     */
    fields: Array<string>;
    /**
     * 上传的rul
     */
    url?: string;
}
/**
 * @param options  需要自动上传
 * @constructor
 */
declare const FileUpload: <T extends FeignClient>(options: AutoFileUploadOptions) => Function;

/**
 * http retry options
 */
interface HttpRetryOptions {
    /**
     * number of retries
     * default：1
     */
    retries?: number;
    /**
     * how long after the request fails, retry, in milliseconds
     * default：100 ms
     */
    delay?: number;
    /**
     * max timeout times
     * default：25 * 1000 ms
     */
    maxTimeout?: number;
    /**
     * do you need to continue to try again
     * @param response
     */
    when?: (response: HttpResponse) => boolean;
    /**
     * custom retry processing
     * @param request  request data
     * @param response response data
     */
    onRetry?(request: HttpRequest, response: HttpResponse): Promise<HttpResponse>;
}

/**
 * 请求重试
 * @param options
 * @constructor
 */
declare const FeignRetry: <T extends FeignClient>(options: HttpRetryOptions) => Function;

/**
 * Intercepts client-side HTTP requests.
 */
interface ClientHttpRequestInterceptorInterface<T extends HttpRequest = HttpRequest> {
    interceptor: ClientHttpRequestInterceptorFunction<T>;
}
/**
 *  Intercept the given request, and return a response
 */
declare type ClientHttpRequestInterceptorFunction<T extends HttpRequest = HttpRequest> = (req: T) => Promise<T>;
declare type ClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> = ClientHttpRequestInterceptorFunction<T> | ClientHttpRequestInterceptorInterface<T>;

/**
 *
 */
interface InterceptingHttpAccessor {
    /**
     * Set the request interceptors that this http client should use.
     * @param interceptors
     */
    setInterceptors: (interceptors: ClientHttpRequestInterceptor[]) => void;
    /**
     * Get the request interceptors
     */
    getInterceptors: () => ClientHttpRequestInterceptor[];
}

/**
 * http request body
 */
declare type HttpRequestBody = string | Record<string, any>;
/**
 * http request client
 */
interface HttpClient<T extends HttpRequest = HttpRequest> extends HttpAdapter<T>, InterceptingHttpAccessor {
    /**
     *  get request
     * @param url
     * @param headers
     * @param timeout
     */
    get: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     *  delete request
     * @param url
     * @param headers
     * @param timeout
     */
    delete: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     *  delete request
     * @param url
     * @param headers
     * @param timeout
     */
    head: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     * post request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    post: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     * put request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    put: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     * put request
     * @param url
     * @param body  serialize the body to a string based on the `Content-Type` type in the request header
     * @param headers
     * @param timeout
     */
    patch: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
}

/**
 * Generic callback interface used by {@link RestTemplate}'s retrieval methods
 * Implementations of this interface perform the actual work of extracting data
 * from a {@link HttpResponse}, but don't need to worry about exception
 * handling or closing resources.
 *
 * <p>Used internally by the {@link RestTemplate}, but also useful for application code.
 *
 */
interface ResponseExtractorInterface<T = any> {
    extractData: ResponseExtractorFunction<T>;
}
/**
 * Extract data from the given {@code HttpResponse} and return it.
 * @param response the HTTP response
 * @return the extracted data
 */
declare type ResponseExtractorFunction<T = any> = (response: HttpResponse) => T | Promise<T> | null | undefined;
declare type ResponseExtractor<T = any> = ResponseExtractorFunction<T> | ResponseExtractorInterface<T>;

/**
 * Interface specifying a basic set of RESTful operations.
 * Implemented by {@link RestTemplate}. Not often used directly, but a useful
 * option to enhance testability, as it can easily be mocked or stubbed.
 */
interface RestOperations {
    /**
     * Retrieve a representation by doing a GET on the specified URL.
     * The response (if any) is converted and returned.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    getForObject: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    /**
     * Retrieve a representation by doing a GET on the URI template.
     * The response is converted and stored in an {@link HttpResponse}.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    getForEntity: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    /**
     * Retrieve all headers of the resource specified by the URI template.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return all HTTP headers of that resource
     * @see {@link UriVariable}
     */
    headForHeaders: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<Record<string, string>>;
    /**
     * Create a new resource by POSTing the given object to the URI template,
     * and returns the response as {@link HttpResponse}.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param requestBody the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    postForEntity: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    /**
     * Create a new resource by POSTing the given object to the URI template, and returns the value of
     * the {@code Location} header. This header typically indicates where the new resource is stored.
     * <p>URI Template variables are expanded using the given map.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param requestBody the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the value for the {@code Location} header
     * @see {@link UriVariable}
     */
    postForLocation: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<string>;
    /**
     * Create a new resource by POSTing the given object to the URI template,
     * and returns the representation found in the response.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param requestBody the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    postForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    /**
     * Create or update a resource by PUTting the given object to the URI.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * @param url the URL
     * @param requestBody the Object to be PUT (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @see {@link UriVariable}
     */
    put: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    /**
     * Update a resource by PATCHing the given object to the URL,
     * and return the representation found in the response.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p><b>NOTE: The standard JDK HTTP library does not support HTTP PATCH.
     * You need to use the Apache HttpComponents or OkHttp request factory.</b>
     * @param url the URL
     * @param requestBody the object to be PATCHed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    patchForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    /**
     * Delete the resources at the specified URI.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @see {@link UriVariable}
     */
    delete: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    /**
     * Return the value of the Allow header for the given URI.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the value of the allow header
     * @see {@link UriVariable}
     */
    optionsForAllow: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpMethod[]>;
    /**
     * Execute the HTTP method to the given URL, preparing the request with the，and reading the response with a {@link ResponseExtractor}.
     * @param url the URL
     * @param method the HTTP method (GET, POST, etc)
     * @param uriVariables object that extracts the return value from the response
     * @param requestBody object that prepares the request
     * @param responseExtractor object that extracts the return value from the response
     * @param headers
     * @return an arbitrary object, as returned by the {@link ResponseExtractor}
     */
    execute: <E = any>(url: string, method: HttpMethod | string, uriVariables?: UriVariable, requestBody?: any, responseExtractor?: ResponseExtractor<E>, headers?: Record<string, string>) => Promise<E>;
}
/**
 * uri path variable
 * example url: "http://a.b.com/{module}/{id}", ["member",1]  ==> "http://a.b.com/member/1"
 */
declare type UriPathVariable = Array<boolean | string | number | Date>;
/**
 * query params type
 */
declare type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;
/**
 * uri variable type
 * example url: "http://a.b.com/",{module:"member",id:1}  ==> "http://a.b.com/?module=member&id=1"
 */
declare type UriVariable = UriPathVariable | QueryParamType;

/**
 * feign的代理相关配置
 */
interface FeignClientMethodConfig {
    /**
     * 请求配置
     */
    requestMapping?: RequestMappingOptions;
    /**
     * 签名相关
     */
    signature?: SignatureOptions;
    /**
     * 重试相关配置
     */
    retryOptions?: HttpRetryOptions;
    /**
     * 缓存相关配置
     */
    cacheOptions?: any;
    /**
     * 自动上传的相关配置
     */
    fileUploadOptions?: AutoFileUploadOptions;
    /**
     * 数据混淆配置
     */
    dataObfuscationOptions?: DataObfuscationOptions;
}

/**
 * feign proxy client
 */
interface FeignProxyClient extends FeignClient {
    /**
     * 服务方法的名称或者是访问路径
     */
    readonly serviceName: string;
    /**
     * feign的代理配置
     */
    readonly feignOptions: FeignOptions;
    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => FeignClientMethodConfig;
}

/**
 * feign client builder
 */
interface FeignClientBuilderInterface<T extends FeignProxyClient = FeignProxyClient> {
    build: FeignClientBuilderFunction<T>;
}
declare type FeignClientBuilderFunction<T extends FeignProxyClient = FeignProxyClient> = (client: T) => T;
declare type FeignClientBuilder<T extends FeignProxyClient = FeignProxyClient> = FeignClientBuilderFunction<T> | FeignClientBuilderInterface<T>;

/**
 * 解析url
 * @param apiService  接口服务
 * @param methodName  服务方法名称
 */
declare type RequestURLResolver = (apiService: FeignProxyClient, methodName: string) => string;

/**
 * resolve request header
 */
declare type RequestHeaderResolver = (apiService: FeignProxyClient, methodName: string, headers: Record<string, string>, data: UriVariable) => Record<string, string>;

/**
 * api signature strategy
 */
interface ApiSignatureStrategy {
    /**
     * @param args
     */
    sign: (...args: any[]) => void;
}
interface SimpleApiSignatureStrategy extends ApiSignatureStrategy {
    /**
     * 签名
     * @param fields        需要参与签名的字段
     * @param data          请求数据
     * @param feignOptions  请求数据
     */
    sign: (fields: string[], data: UriVariable, feignOptions: FeignOptions) => void;
}

/**
 * feign client executor
 */
interface FeignClientExecutor<T extends FeignClient = FeignProxyClient> {
    /**
     * execute proxy service method
     * @param methodName   method name
     * @param args        method params
     */
    invoke: (methodName: string, ...args: any[]) => Promise<any>;
}

interface FeignRequestBaseOptions {
    /**
     * external query parameters
     */
    queryParams?: QueryParamType;
    body?: any;
    /**
     * external request headers
     * support '{xxx}' expression，Data can be obtained from request body or query data
     *
     */
    headers?: Record<string, string>;
    /**
     * 是否开启gzip压缩
     * 默认：false
     */
    enabledGzip?: boolean;
}
/**
 * 请求进度条配置
 */
interface ProgressBarOptions {
    /**
     * 是否使用蒙版
     */
    mask?: boolean;
    /**
     * 提示的延迟时间，
     * 单位毫秒，默认：300
     */
    delay?: number;
    /**
     * 进度条提示标题
     */
    title?: string;
    /**
     * 进度条提示图标
     * 图标，字体图标名称或图片url
     */
    icon?: string;
}
interface UIOptions {
    /**
     * 请求进度
     * @param data
     */
    requestProgress?: (data: {
        /**
         * 进度
         */
        progress: number;
        /**
         * 当前状态
         * state:’1’: 请求连接中
         * opened:’2’: 返回响应头中
         * received:’3’: 正在加载返回数据
         */
        readyState: number;
        /**
         * http 响应码
         */
        httpCode: number;
        /**
         * http 响应状态（响应码）描述
         */
        statusText?: string;
        /**
         * 响应头
         */
        headers: object;
    }) => void;
    /**
     * 是否使用统一的提示
     * 默认：true
     */
    useUnifiedToast?: boolean;
    /**
     * 是否使用进度条,如果该值为false 则不会使用统一的提示
     * 默认：true
     */
    useProgressBar?: boolean;
    /**
     * 进度条配置
     * 进度条控制可以在拦截器实现
     *
     * @see {@link  ./ui/ProcessBarExecutorInterceptor.ts}
     */
    progressBarOptions?: ProgressBarOptions;
}
interface DataOptions {
    /**
     * 使用统一响应转换
     * 默认：true
     */
    useUnifiedTransformResponse?: boolean;
    /**
     * 是否过滤提交数据中的 空字符串，null的数据，数值类型的NaN
     * 默认：true
     */
    filterNoneValue?: boolean;
    /**
     * 数据混淆配置
     */
    dataObfuscationOptions?: DataObfuscationOptions;
    /**
     * 响应数据抓取
     */
    responseExtractor?: ResponseExtractor;
}
interface FeignRequestContextOptions extends UIOptions, DataOptions {
}
interface FeignRequestOptions extends FeignRequestBaseOptions, FeignRequestContextOptions {
}

/**
 * execute interceptor
 */
interface FeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> {
    /**
     * in request before invoke
     * @param options feign request options
     * @return new options
     */
    preHandle: (options: T) => T | Promise<T>;
    /**
     * in request after invoke
     * @param options
     * @param response
     */
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => Promise<any> | any;
}

/**
 * feign configuration
 * since the method of changing the interface is called every time, it is necessary to implement memory.
 */
interface FeignConfiguration {
    /**
     * get http adapter
     */
    getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;
    /**
     * get http client
     */
    getHttpClient: <T extends HttpRequest = HttpRequest>() => HttpClient;
    getRestTemplate: () => RestOperations;
    getFeignClientExecutor: <T extends FeignProxyClient = FeignProxyClient>(client: T) => FeignClientExecutor;
    getFeignClientBuilder?: <T extends FeignProxyClient = FeignProxyClient>() => FeignClientBuilder<T>;
    getRequestURLResolver?: () => RequestURLResolver;
    getRequestHeaderResolver?: () => RequestHeaderResolver;
    getApiSignatureStrategy?: () => ApiSignatureStrategy;
    getFeignClientExecutorInterceptors?: () => FeignClientExecutorInterceptor[];
    /**
     * get default feign request options
     */
    getDefaultFeignRequestOptions?: () => FeignRequestOptions;
}

interface FeignOptions {
    /**
     * 所属的api模块
     * 通过api模块名称可以区分不同模块的配置，比如api入口地址等
     *
     * api module name
     * @see {@link ../constant/FeignConstVar.ts ==> defaultApiModuleName}
     */
    apiModule?: string;
    /**
     * 请求uri
     * 默认：类名
     * request uri，default use feign client class name
     * example: SystemServiceFeignClient ==> SystemService
     */
    value?: string;
    /**
     * 绝对URL或可解析的主机名（协议是可选的）
     * an absolute URL or resolvable hostname (the protocol is optional)
     */
    url?: string;
    /**
     * feign configuration
     */
    configuration?: FeignConfiguration[];
}
/**
 * Mark a class as feign　client
 * @param options
 * @constructor
 */
declare const Feign: <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions) => Function;

/**
 * http media type
 */
declare enum HttpMediaType {
    /**
     * 表单
     */
    FORM_DATA = "application/x-www-form-urlencoded",
    /**
     * 文件上传
     */
    MULTIPART_FORM_DATA = "multipart/form-data",
    /**
     * json
     */
    APPLICATION_JSON = "application/json",
    /**
     * JSON_UTF_8
     */
    APPLICATION_JSON_UTF8 = "application/json;charset=UTF-8",
    TEXT = "text/plain",
    HTML = "text/html",
    /**
     * 流
     */
    APPLICATION_STREAM = "application/octet-stream"
}

/**
 * abstract http client
 */
declare abstract class AbstractHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T> {
    protected httpAdapter: HttpAdapter<T>;
    protected interceptors: Array<ClientHttpRequestInterceptor<T>>;
    protected defaultProduce: HttpMediaType;
    protected constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    delete: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    get: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    head: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    patch: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    post: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    put: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse<any>>;
    /**
     * send an http request to a remote server
     * @param req
     */
    abstract send: (req: T) => Promise<HttpResponse>;
    getInterceptors: () => ClientHttpRequestInterceptor<T>[];
    setInterceptors: (interceptors: ClientHttpRequestInterceptor<T>[]) => void;
}

/**
 * default http client
 */
declare class DefaultHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {
    constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    send: (req: T) => Promise<HttpResponse<any>>;
}

/**
 * Network status listener
 */
interface NetworkStatusListener {
    /**
     * get network status
     */
    getNetworkStatus: () => Promise<NetworkStatus>;
    /**
     * listener
     */
    onChange: (callback: (networkStatus: NetworkStatus) => void) => void;
}
interface NetworkStatus {
    /**
     * 当前是否有网络连接
     */
    isConnected: boolean;
    /**
     * 网络类型
     */
    networkType: NetworkType;
}
declare enum NetworkType {
    WIFI = "wifi",
    "2G" = "2g",
    "3G" = "3g",
    "4G" = "4g",
    "5G" = "5g",
    /**
     * Android 下不常见的网络类型
     */
    UN_KNOWN = "unknown",
    /**
     * 无网络
     */
    NONE = "none"
}

/**
 * Downgrade processing without network
 */
interface NoneNetworkFailBack<T extends HttpRequest = HttpRequest> {
    /**
     *  Network is closed
     * @param request
     */
    onNetworkClose: (request: T) => Promise<any> | any;
    /**
     * Network is activated
     */
    onNetworkActive: () => Promise<void> | void;
}

/**
 * Check whether the client network is available and can be degraded with custom processing.
 * For example, stack requests until the network is available or abandon the request
 */
declare class NetworkClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    private networkStatusListener;
    private noneNetworkHandler;
    private networkStatus;
    private static HANDLE_FAIL_BACK_FLAG;
    constructor(networkStatusListener: NetworkStatusListener, noneNetworkHandler?: NoneNetworkFailBack<T>);
    interceptor: (req: T) => Promise<T>;
    private handleFailBack;
}

/**
 * support retry http client
 * HttpClient with retry, need to be recreated each time you use this client
 */
declare class RetryHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {
    private retryOptions;
    private countRetry;
    private retryEnd;
    constructor(httpAdapter: HttpAdapter<T>, retryOptions: HttpRetryOptions, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    send: (req: T) => Promise<HttpResponse<any>>;
    /**
     * try retry request
     * @param request
     * @param response
     */
    private tryRetry;
    /**
     * default retry handle
     * @param req
     * @param response
     */
    private onRetry;
    /**
     * whether to retry
     * @param response
     */
    private whenRetry;
}

/**
 * If the url starts with @xxx, replace 'xxx' with the value of name='xxx' in the routeMapping
 * example url='@memberModule/find_member  routeMapping = {memberModule:"http://test.a.b.com/member"} ==> 'http://test.a.b.com/member/find_member'
 */
declare class RoutingClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    /**
     * mapping between api module and url
     */
    protected routeMapping: Record<string, string>;
    constructor(routeMapping: Record<string, string> | string);
    interceptor: (req: T) => Promise<T>;
}

/**
 * simple network status listener
 *
 * The current request is suspended when the network status is unavailable, waiting for a while, and the request is continued after the network is restored.
 * {@field maxWaitTime}
 * {@field maxWaitLength}
 */
declare class SimpleNetworkStatusListener<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {
    private waitQueue;
    private maxWaitTime;
    private maxWaitLength;
    /**
     * @param maxWaitTime
     * @param maxWaitLength
     */
    constructor(maxWaitTime?: number, maxWaitLength?: number);
    onNetworkActive: () => void | Promise<void>;
    onNetworkClose: (request: T) => any;
    private addWaitItem;
    private tryRemoveInvalidItem;
    private rejectHttpRequest;
}

/**
 *  request data encoder
 */
interface HttpRequestDataEncoder<T extends FeignRequestOptions = FeignRequestOptions> {
    /**
     * encode
     * @param request
     * @param otherArgs 其他参数
     */
    encode: (request: T) => Promise<T>;
}

/**
 * response data
 */
interface HttpResponseDataDecoder<E = any> {
    /**
     * decode
     * @param response
     */
    decode: (response: E) => E;
}

/**
 * codec executor interceptor
 */
declare class CodecFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    protected encoders: HttpRequestDataEncoder<T>[];
    protected decoders: HttpResponseDataDecoder[];
    constructor(encoders: HttpRequestDataEncoder<T>[], decoders: HttpResponseDataDecoder[]);
    postHandle: <E = any>(options: T, response: E) => Promise<E>;
    preHandle: (options: T) => Promise<T>;
}

declare type DateConverter = (date: Date) => number | string;
declare const timeStampDateConverter: DateConverter;
declare const stringDateConverter: (fmt?: DateFormatType) => DateConverter;

/**
 * encode/format the Date type in the request data or query params
 * Default conversion to timestamp
 */
declare class DateEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {
    private dateConverter;
    constructor(dateConverter?: DateConverter);
    encode: (request: T) => Promise<T>;
    private converterDate;
}

declare const registry: {
    setDefaultFeignConfiguration(configuration: FeignConfiguration): void;
    getDefaultFeignConfiguration(): FeignConfiguration;
};

/**
 * default api module name
 */
declare const defaultApiModuleName = "default";
/**
 * http header content type name
 */
declare const contentTypeName = "Content-Type";
/**
 * feign client metadata key
 */
declare const FEIGN_CLINE_META_KEY = "FEIGN";
/**
 * match shaped like example '1{xxx}2ll3' string
 */
declare const matchUrlPathVariable: RegExp;
/**
 * grab shaped like example '1{abc}2ll3{efg}' string  ==> abc, efg
 */
declare const grabUrlPathVariable: RegExp;

interface HttpHeader {
    name: string;
    value: string;
}
declare abstract class MappedInterceptor {
    protected includePatterns: string[];
    protected excludePatterns: string[];
    protected includeMethods: HttpMethod[];
    protected excludeMethods: HttpMethod[];
    protected includeHeaders: HttpHeader[];
    protected excludeHeaders: HttpHeader[];
    protected pathMatcher: PathMatcher;
    constructor(includePatterns: string[], excludePatterns: string[], includeMethods: HttpMethod[], excludeMethods: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    /**
     * Determine a match for the given lookup path.
     * @param req
     * @return {@code true} if the interceptor applies to the given request path or http methods or http headers
     */
    matches: (req: HttpRequest) => boolean;
    /**
     * Determine a match for the given lookup path.
     * @param lookupPath the current request path
     * @param pathMatcher a path matcher for path pattern matching
     * @return {@code true} if the interceptor applies to the given request path
     */
    matchesUrl: (lookupPath: string, pathMatcher?: PathMatcher) => boolean;
    /**
     * Determine a match for the given http method
     * @param method
     */
    matchesMethod: (method: HttpMethod) => boolean;
    /**
     * Determine a match for the given request headers
     * @param header
     */
    matchesHeaders: (header: Record<string, string>) => boolean;
    private doMatch;
    private converterHeaders;
}

declare class MappedFeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> extends MappedInterceptor implements FeignClientExecutorInterceptor<T> {
    private feignClientExecutorInterceptor;
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor<T>, includePatterns?: string[], excludePatterns?: string[], includeMethods?: HttpMethod[], excludeMethods?: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => any;
    preHandle: (options: T) => T | Promise<T>;
}

/**
 * match interceptor
 */
declare class MappedClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> extends MappedInterceptor implements ClientHttpRequestInterceptorInterface<T> {
    private clientInterceptor;
    constructor(clientInterceptor: ClientHttpRequestInterceptor<T>, includePatterns?: string[], excludePatterns?: string[], includeMethods?: HttpMethod[], excludeMethods?: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    interceptor: (req: T) => Promise<T>;
}

/**
 * resolve response data converter to HttpResponse
 */
interface ResolveHttpResponse<T = any> {
    resolve: (data: T) => HttpResponse;
}

declare class CommonResolveHttpResponse implements ResolveHttpResponse<Response> {
    resolve: (resp: Response) => HttpResponse<any>;
}

/**
 * 简单的请求头解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成请求头
 */
declare const simpleRequestHeaderResolver: RequestHeaderResolver;

/**
 * restful requet url resolver
 * @param apiService
 * @param methodName
 */
declare const restfulRequestURLResolver: RequestURLResolver;

/**
 * 简单的url解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成url
 */
declare const simpleRequestURLResolver: RequestURLResolver;

/**
 * 根据annotation生成代理服务方法的配置
 */
declare type GenerateAnnotationMethodConfig<T extends FeignClient = FeignClient, O extends FeignClientMethodConfig = FeignClientMethodConfig> = (targetService: T, methodName: string, options: O) => void;

/**
 * 默认的代理服务方法配置生成
 * @param targetService
 * @param methodName
 * @param options
 */
declare const defaultGenerateAnnotationMethodConfig: GenerateAnnotationMethodConfig<FeignClient, FeignClientMethodConfig>;

/**
 * void response extractor
 * @param response
 */
declare const voidResponseExtractor: (response: HttpResponse<any>) => Promise<void>;
/**
 * object response extractor
 * @param response
 */
declare const objectResponseExtractor: ResponseExtractor<any>;
/**
 * head response extractor
 * @param response
 */
declare const headResponseExtractor: (response: HttpResponse<any>) => Promise<Record<string, string>>;
/**
 * options method response extractor
 * @param response
 */
declare const optionsMethodResponseExtractor: (response: HttpResponse<any>) => Promise<HttpMethod[]>;

/**
 * Defines methods for expanding a URI template with variables.
 */
interface UriTemplateHandlerInterface {
    expand: UriTemplateHandlerFunction;
}
/**
 * Expand the given URI template with a map of URI variables.
 * @param uriTemplate the URI template
 * @param uriVariables variable values
 * @return the created URI instance
 */
declare type UriTemplateHandlerFunction = (uriTemplate: string, uriVariables: UriVariable) => string;
declare type UriTemplateHandler = UriTemplateHandlerInterface | UriTemplateHandlerFunction;

declare const defaultUriTemplateFunctionHandler: UriTemplateHandlerFunction;
declare class DefaultUriTemplateHandler implements UriTemplateHandlerInterface {
    expand: UriTemplateHandlerFunction;
}

/**
 * Strategy interface used by the {@link RestTemplate} to determine
 * whether a particular response has an error or not.
 */
interface ResponseErrorHandlerInterFace<T extends HttpRequest = HttpRequest, E = any> {
    /**
     * Indicate whether the given response has any errors.
     * <p>Implementations will typically inspect the
     * {@link HttpResponse#statusCode HttpStatus} of the response.
     * @param response the response to inspect
     * @return {@code true} if the response has an error; {@code false} otherwise
     */
    handleError: ResponseErrorHandlerFunction<T, E>;
}
/**
 * Handle the error in the given response.
 * <p>This method is only called when {@link #hasError(ClientHttpResponse)}
 * has returned {@code true}.
 * @param response the response with the error
 */
declare type ResponseErrorHandlerFunction<T extends HttpRequest = HttpRequest, E = any> = (request: T, response: HttpResponse<any>) => Promise<E>;
declare type ResponseErrorHandler<T extends HttpRequest = HttpRequest, E = any> = ResponseErrorHandlerInterFace<T> | ResponseErrorHandlerFunction<T>;

/**
 *  http rest template
 */
declare class RestTemplate implements RestOperations {
    private httpClient;
    private _uriTemplateHandler;
    private _responseErrorHandler;
    constructor(httpClient: HttpClient);
    delete: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    getForEntity: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    getForObject: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    headForHeaders: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<Record<string, string>>;
    optionsForAllow: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpMethod[]>;
    patchForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    postForEntity: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    postForLocation: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<string>;
    postForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    put: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    execute: <E = any>(url: string, method: HttpMethod, uriVariables?: UriVariable, requestBody?: any, responseExtractor?: ResponseExtractor<E>, headers?: Record<string, string>) => Promise<E>;
    set uriTemplateHandler(uriTemplateHandler: UriTemplateHandler);
    set responseErrorHandler(responseErrorHandler: ResponseErrorHandler);
}

/**
 * process bar
 */
interface RequestProgressBar {
    showProgressBar: (progressBarOptions?: ProgressBarOptions) => void;
    hideProgressBar: () => void;
}

/**
 * process bar executor
 */
declare class ProcessBarExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    /**
     * 进度条计数器，用于在同时发起多个请求时，
     * 统一控制加载进度条
     */
    private static count;
    /**
     * 进度条
     */
    protected progressBar: RequestProgressBar;
    /**
     * 当前执行的定时器
     */
    protected timerId: any;
    /**
     * 进度条的相关配置
     */
    protected progressBarOptions: ProgressBarOptions;
    /**
     * 防止抖动，在接口很快响应的时候，不显示进度条
     */
    protected preventJitter: boolean;
    constructor(progressBar: RequestProgressBar, progressBarOptions?: ProgressBarOptions);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => E;
    preHandle: (options: T) => Promise<T>;
}

/**
 * determine if two HttpMediaTypes are the same
 * @param type1
 * @param type2
 */
declare const mediaTypeIsEq: (type1: string, type2: string) => boolean;

declare const supportRequestBody: (method: string) => boolean;
/**
 * serialize http request body for content type
 *
 * @param method
 * @param body
 * @param contentType
 * @param filterNoneValue  filter none value
 */
declare const serializeRequestBody: (method: string, body: HttpRequestBody, contentType: HttpMediaType, filterNoneValue?: boolean) => string;
declare const filterNoneValueAndNewObject: (body: Record<string, any>) => {};
/**
 * assemble the query string
 *
 * @param obj
 * @param filterNoneValue
 * @param sep
 * @param eq
 * @param name
 */
declare const queryStringify: (obj: ParsedUrlQueryInput, filterNoneValue?: boolean, sep?: string, eq?: string, name?: string) => string;

/**
 * invoke a single function interface
 * @param handle
 */
declare const invokeFunctionInterface: <T, I>(handle: T) => I;

declare class DefaultFeignClientBuilder implements FeignClientBuilderInterface {
    build: FeignClientBuilderFunction<FeignProxyClient>;
}
declare const defaultFeignClientBuilder: FeignClientBuilderFunction;

/**
 * default feign client executor
 */
declare class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {
    protected apiService: T;
    protected requestURLResolver: RequestURLResolver;
    protected requestHeaderResolver: RequestHeaderResolver;
    protected apiSignatureStrategy: ApiSignatureStrategy;
    protected restTemplate: RestOperations;
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];
    protected defaultRequestOptions: FeignRequestOptions;
    constructor(apiService: T);
    invoke: (methodName: string, ...args: any[]) => Promise<any>;
    private preHandle;
    private postHandle;
}

export { AbstractHttpClient, ApiSignatureStrategy, ClientHttpRequestInterceptor, ClientHttpRequestInterceptorFunction, ClientHttpRequestInterceptorInterface, CodecFeignClientExecutorInterceptor, CommonResolveHttpResponse, DataObfuscation, DateConverter, DateEncoder, DefaultFeignClientBuilder, DefaultFeignClientExecutor, DefaultHttpClient, DefaultUriTemplateHandler, DeleteMapping, FEIGN_CLINE_META_KEY, Feign, FeignClient, FeignClientBuilder, FeignClientBuilderFunction, FeignClientBuilderInterface, FeignClientExecutor, FeignClientExecutorInterceptor, FeignClientMethodConfig, FeignConfiguration, registry as FeignConfigurationRegistry, FeignProxyClient, FeignRequestBaseOptions, FeignRequestContextOptions, FeignRequestOptions, FeignRetry, FileUpload, GenerateAnnotationMethodConfig, HttpAdapter, HttpClient, HttpMediaType, HttpMethod, HttpRequest, HttpRequestBody, HttpRequestDataEncoder, HttpResponse, HttpResponseDataDecoder, HttpRetryOptions, MappedClientHttpRequestInterceptor, MappedFeignClientExecutorInterceptor, MappedInterceptor, NetworkClientHttpRequestInterceptor, NetworkStatus, NetworkStatusListener, NetworkType, NoneNetworkFailBack, PatchMapping, PostMapping, ProcessBarExecutorInterceptor, PutMapping, RequestHeaderResolver, RequestMapping, RequestProgressBar, RequestURLResolver, ResolveHttpResponse, ResponseErrorHandler, ResponseErrorHandlerFunction, ResponseErrorHandlerInterFace, ResponseExtractor, ResponseExtractorFunction, ResponseExtractorInterface, RestOperations, RestTemplate, RetryHttpClient, RoutingClientHttpRequestInterceptor, Signature, SimpleApiSignatureStrategy, SimpleNetworkStatusListener, UIOptions, UriTemplateHandler, UriTemplateHandlerFunction, UriTemplateHandlerInterface, contentTypeName, defaultApiModuleName, defaultFeignClientBuilder, defaultGenerateAnnotationMethodConfig, defaultUriTemplateFunctionHandler, filterNoneValueAndNewObject, grabUrlPathVariable, headResponseExtractor, invokeFunctionInterface, matchUrlPathVariable, mediaTypeIsEq, objectResponseExtractor, optionsMethodResponseExtractor, queryStringify, restfulRequestURLResolver, serializeRequestBody, simpleRequestHeaderResolver, simpleRequestURLResolver, stringDateConverter, supportRequestBody, timeStampDateConverter, voidResponseExtractor };
