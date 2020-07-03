/// <reference types="lodash" />
import { RuleItem } from 'async-validator';
import { Cancelable } from 'lodash';
import { DateFormatType } from 'fengwuxp-common-utils/lib/date/DateFormatUtils';
import { PathMatcher } from 'fengwuxp-common-utils/lib/match/PathMatcher';
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

/**
 * The payload object used to make the HTTP request
 * {@see HttpAdapter}
 * {@see HttpClient}
 */
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
     * {@see HttpMethod}
     */
    method: HttpMethod | string;
    /**
     * request headers
     */
    headers?: Record<string, string>;
    /**
     * request time out times
     * The default value needs to be provided by the implementation class that implements the HttpAdapter interface
     * {@see HttpAdapter}
     */
    timeout?: number;
}

/**
 * http request response
 *
 * Unified http response. Implementations of different platforms need to return instances of the object or subclasses of the object.
 * {@see HttpAdapter}
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
 *
 * {@param T} T extends {@see HttpRequest} Implementers can expand according to different situations
 * {@see HttpResponse}
 */
interface HttpAdapter<T extends HttpRequest = HttpRequest> {
    /**
     * send an http request to a remote server
     * @param req
     */
    send: (req: T) => Promise<HttpResponse>;
}

/**
 *  Request API, type of authentication
 *  {@see AuthenticationClientHttpRequestInterceptor#interceptor}
 *  {@see BaseRequestMappingOptions#authenticationType}
 */
declare enum AuthenticationType {
    NONE = 0,
    TRY = 1,
    FORCE = 2
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
     * 接口认证类型
     *  {@see AuthenticationClientHttpRequestInterceptor#interceptor}
     *  {@see DefaultFeignClientExecutor#tryCheckAuthorizedStatus}
     */
    authenticationType?: AuthenticationType;
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
 * GetMapping
 */
declare const GetMapping: Mapping<BaseRequestMappingOptions>;

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
interface SignatureOptions<T = any> {
    /**
     * 要签名的字段名称
     */
    fields: Array<keyof T> | Array<string>;
}
/**
 * @param options 签名配置
 * @constructor
 */
declare const Signature: <REQ = any, T extends FeignClient = FeignClient>(options: SignatureOptions<REQ>) => Function;

/**
 * 需要自动上传配置
 */
interface AutoFileUploadOptions<T = any> {
    /**
     * 需要执行上传动作的字段
     */
    fields: Array<keyof T> | Array<string>;
    /**
     * 上传的rul
     */
    url?: string;
}
/**
 * @param options  需要自动上传
 * @constructor
 */
declare const FileUpload: <REQ = any, T extends FeignClient = FeignClient>(options: AutoFileUploadOptions<REQ>) => Function;

/**
 * http retry options
 * {@see RetryHttpClient}
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
 * Only executed in http client
 * {@see HttpClient#send}
 * {@see DefaultHttpClient#send}
 */
interface ClientHttpRequestInterceptorInterface<T extends HttpRequest = HttpRequest> {
    /**
     * Intercept before http request, you can change the requested information
     */
    interceptor: ClientHttpRequestInterceptorFunction<T>;
}
/**
 *  Intercept the given request, and return a response
 */
declare type ClientHttpRequestInterceptorFunction<T extends HttpRequest = HttpRequest> = (req: T) => Promise<T>;
/**
 * Throw an exception or Promise.reject will interrupt the request
 */
declare type ClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> = ClientHttpRequestInterceptorFunction<T> | ClientHttpRequestInterceptorInterface<T>;

/**
 * {@see ClientHttpRequestInterceptor} accessor
 */
interface HttpClientInterceptorAccessor {
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
 * Provides basic http request capabilities
 * Extend from {@see HttpAdapter }
 */
interface HttpClient<T extends HttpRequest = HttpRequest> extends HttpAdapter<T>, HttpClientInterceptorAccessor {
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

declare type ValidatorDescriptorAll<T> = {
    [key in keyof T]: RuleItem;
};
declare type ValidatorDescriptor<T> = Partial<ValidatorDescriptorAll<T>>;
interface ValidateInvokeOptions {
    /**
     * default true
     */
    useToast?: boolean;
}
/**
 * request data validator
 */
interface ClientRequestDataValidator {
    /**
     *
     * @param requestData  validate data source
     * @param descriptor   validate rule desc
     * @param options      invoke options
     */
    validate: <T>(requestData: T, descriptor: ValidatorDescriptor<T>, options?: ValidateInvokeOptions | false) => Promise<T>;
}

/**
 * 需要自动上传配置
 */
declare type ValidateSchemaOptions<T> = ValidatorDescriptor<T>;

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
    /**
     * 数据验证配置
     */
    validateSchemaOptions?: ValidateSchemaOptions<any>;
}

/**
 * feign proxy client
 */
interface FeignProxyClient extends FeignClient {
    /**
     * service name or access path
     */
    readonly serviceName: () => string;
    /**
     * feign proxy options
     */
    readonly feignOptions: () => Readonly<FeignMemberOptions>;
    /**
     * get feign configuration
     */
    readonly feignConfiguration: () => Readonly<FeignConfiguration>;
    /**
     * 获取获取接口方法的配置
     * @param serviceMethod  服务方法名称
     */
    getFeignMethodConfig: (serviceMethod: string) => Readonly<FeignClientMethodConfig>;
}

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
/**
 * process bar
 */
interface RequestProgressBar<T extends ProgressBarOptions = ProgressBarOptions> {
    showProgressBar: (progressBarOptions?: T) => void;
    hideProgressBar: () => void;
}

interface FeignRequestId {
    /**
     * 单次http请求的id，用于贯穿整个http请求的过程
     * 在这个过程中可以通过该id获取到请求的上下文内容
     * {@see HttpRequestGenerator}
     */
    requestId?: Readonly<string>;
}
/**
 * Used by the feign client to pass data during the request process and the interceptor
 * {@code FeignClientExecutorInterceptor#preHandle} execution process, until the {@code RestTemplate#execute} method is called
 *
 * {@see FeignClientExecutorInterceptor#preHandle}
 * {@see RestTemplate#execute}
 */
interface FeignRequestBaseOptions extends FeignRequestId {
    /**
     * external query parameters
     */
    queryParams?: QueryParamType;
    /**
     * request body
     */
    body?: any;
    /**
     * external request headers
     * support '{xxx}' expression，Data can be obtained from request body or query data
     * {@see RequestHeaderResolver}
     */
    headers?: Record<string, string>;
}
interface FileUploadProgressBarOptions extends ProgressBarOptions {
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
    /**
     * 进度条配置
     * 进度条控制可以在拦截器实现
     *
     * @see {@link  ./ui/ProcessBarExecutorInterceptor.ts}
     */
    fileUploadProgressBar?: FileUploadProgressBarOptions;
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
     * 数据验证调用时的配置
     */
    validateInvokeOptions?: ValidateInvokeOptions | false;
    /**
     * 响应数据抓取
     */
    responseExtractor?: ResponseExtractor;
}
interface FeignRequestContextOptions extends UIOptions, DataOptions {
}
interface FeignRequestOptions extends FeignRequestBaseOptions, FeignRequestContextOptions {
    /**
     * enable gzip
     * default：false
     */
    enabledGzip?: boolean;
    /**
     * 接收的数据
     */
    consumes?: HttpMediaType[];
}

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
     * sign
     * @param fields        need sign filed
     * @param data          request body data or url param
     * @param feignOptions  feign request options
     */
    sign: (fields: string[], data: UriVariable, feignRequestBaseOptions: FeignRequestBaseOptions) => void;
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

/**
 * Only executed in feign client
 * {@see FeignClientExecutor#invoke}
 * {@see DefaultFeignClientExecutor#invoke}
 */
interface FeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> {
    /**
     * in request before invoke
     * @param options feign request options
     * @return new options
     */
    preHandle?: (options: T) => T | Promise<T>;
    /**
     * in request after invoke
     * @param options
     * @param response
     */
    postHandle?: <E = HttpResponse<any>>(options: T, response: E) => Promise<any> | any;
    /**
     * in request failure invoke
     * @param options
     * @param response
     */
    postError?: (options: T, response: HttpResponse<any>) => Promise<any> | any;
}

/**
 * marked authentication strategy cache support
 *
 * {@see CacheAuthenticationStrategy}
 * {@see AuthenticationClientHttpRequestInterceptor}
 */
interface CacheCapableAuthenticationStrategy {
    /**
     * enable cache support
     * if value is 'true',use {@link CacheAuthenticationStrategy} wrapper
     */
    readonly enableCache: boolean;
    /**
     * clear cache
     * if send send unauthorized event,need clear cache
     * {@link AuthenticationBroadcaster#sendUnAuthorizedEvent}
     */
    clearCache: () => void;
}
/**
 * authentication strategy
 */
interface AuthenticationStrategy<T extends AuthenticationToken = AuthenticationToken> extends Partial<CacheCapableAuthenticationStrategy> {
    /**
     * get authorization header names
     * default :['Authorization']
     */
    getAuthorizationHeaderNames?: () => Array<string>;
    getAuthorization: (req: Readonly<HttpRequest>) => Promise<T> | T;
    refreshAuthorization: (authorization: T, req: Readonly<HttpRequest>) => Promise<T> | T;
    appendAuthorizationHeader: (authorization: T, headers: Record<string, string>) => Record<string, string>;
}
declare const NEVER_REFRESH_FLAG = -1;
interface AuthenticationToken {
    /**
     * authorization info
     */
    authorization: string;
    /**
     * token expire  time
     * {@see NEVER_REFRESH_TIME}
     */
    expireDate: number;
    /**
     * refresh token
     */
    refreshToken?: string;
    /**
     * refresh token expire time
     * {@see NEVER_REFRESH_TIME}
     */
    refreshExpireDate?: number;
}
/**
 * use broadcast event handle authentication
 * {@see HttpStatus.UNAUTHORIZED}
 */
interface AuthenticationBroadcaster {
    /**
     * send unauthorized event
     */
    sendUnAuthorizedEvent: () => void;
    /**
     * receive authorized success event
     * @param handle
     */
    receiveAuthorizedEvent: (handle: () => void) => void;
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
    getRequestURLResolver?: () => RequestURLResolver;
    getRequestHeaderResolver?: () => RequestHeaderResolver;
    getApiSignatureStrategy?: () => ApiSignatureStrategy;
    getAuthenticationStrategy?: () => AuthenticationStrategy;
    getAuthenticationBroadcaster?: () => AuthenticationBroadcaster;
    getFeignClientExecutorInterceptors?: () => FeignClientExecutorInterceptor[];
    /**
     * get default feign request context options
     */
    getDefaultFeignRequestContextOptions?: () => FeignRequestContextOptions;
    /**
     * get default request headers
     */
    getDefaultHttpHeaders?: () => Record<string, string>;
}
declare type FeignConfigurationConstructor = {
    new (...args: any[]): FeignConfiguration;
};

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
    configuration?: FeignConfigurationConstructor;
}
interface FeignMemberOptions extends Pick<FeignOptions, Exclude<keyof FeignOptions, "configuration">> {
    /**
     * feign configuration
     */
    configuration?: FeignConfiguration;
}
/**
 * Mark a class as feign　client
 * @param options
 * @constructor
 */
declare const Feign: <T extends FeignProxyClient = FeignProxyClient>(options: FeignOptions) => Function;

/**
 * abstract http client
 * Request header with 'Content-Type' as 'application/x-www-form-urlencoded' is provided by default
 */
declare abstract class AbstractHttpClient<T extends HttpRequest = HttpRequest> implements HttpClient<T> {
    protected httpAdapter: HttpAdapter<T>;
    protected interceptors: Array<ClientHttpRequestInterceptor<T>>;
    protected defaultProduce: HttpMediaType;
    protected constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    delete: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    get: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    head: (url: string, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    patch: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    post: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    put: (url: string, body: HttpRequestBody, headers?: HeadersInit, timeout?: number) => Promise<HttpResponse>;
    /**
     * send an http request to a remote server
     * @param req
     */
    abstract send: (req: T) => Promise<HttpResponse>;
    getInterceptors: () => Array<ClientHttpRequestInterceptor<T>>;
    setInterceptors: (interceptors: Array<ClientHttpRequestInterceptor<T>>) => void;
}

/**
 * default http client
 * Retry if needed {@see RetryHttpClient}
 */
declare class DefaultHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {
    /**
     * In order to support different js runtime environments, the following parameters need to be provided
     * @param httpAdapter           Request adapters for different platforms
     * @param defaultProduce
     * @param interceptors
     */
    constructor(httpAdapter: HttpAdapter<T>, defaultProduce?: HttpMediaType, interceptors?: Array<ClientHttpRequestInterceptor<T>>);
    send: (req: T) => Promise<HttpResponse>;
    private resolveContentType;
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
    send: (req: T) => Promise<HttpResponse>;
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
    constructor(routeMapping: Record<string, string> | string);
    interceptor: (req: T) => Promise<T>;
}

/**
 *  Authentication client http request interceptor
 *
 *  Support blocking 'authorization' refresh
 */
declare class AuthenticationClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    protected static IS_REFRESH_TOKEN_ING: boolean;
    protected static WAITING_QUEUE: Array<{
        resolve: (value?: any | PromiseLike<any>) => void;
        reject: (reason?: any) => void;
        request: HttpRequest;
    }>;
    private aheadOfTimes;
    private authenticationStrategy;
    private blockingRefreshAuthorization;
    /**
     *
     * @param authenticationStrategy
     * @param aheadOfTimes                default: 5 * 60 * 1000
     * @param blockingRefreshAuthorization
     */
    constructor(authenticationStrategy: AuthenticationStrategy, aheadOfTimes?: number, blockingRefreshAuthorization?: boolean);
    interceptor: (req: T) => Promise<T>;
    /**
     * append authorization header
     * @param authorization
     * @param headers
     */
    private appendAuthorizationHeader;
    /**
     * need append authorization header
     * @param headers
     */
    private needAppendAuthorizationHeader;
    setAuthenticationStrategy: (authenticationStrategy: AuthenticationStrategy<AuthenticationToken>) => void;
}

/**
 * cache AuthenticationStrategy
 * {@see CacheCapableAuthenticationStrategy#enableCache}
 */
declare class CacheAuthenticationStrategy implements AuthenticationStrategy {
    private authenticationStrategy;
    private cacheAuthenticationToken;
    constructor(authenticationStrategy: AuthenticationStrategy<AuthenticationToken>);
    appendAuthorizationHeader: (authorization: AuthenticationToken, headers: Record<string, string>) => Record<string, string>;
    getAuthorization: (req: Readonly<HttpRequest>) => Promise<AuthenticationToken>;
    getAuthorizationHeaderNames: () => string[];
    refreshAuthorization: (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => Promise<AuthenticationToken>;
    clearCache: () => void;
}

/**
 * debounce broadcaster
 */
declare class DebounceAuthenticationBroadcaster implements AuthenticationBroadcaster {
    private broadcaster;
    constructor(broadcaster: AuthenticationBroadcaster);
    receiveAuthorizedEvent(handle: () => void): void;
    sendUnAuthorizedEvent: (() => void) & Cancelable;
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
 * It needs to be configured first in the {@see ClientHttpRequestInterceptorInterface} list
 *
 * Check whether the client network is available and can be degraded with custom processing.
 * For example, stack requests until the network is available or abandon the request
 *
 * Network interception interceptor during the execution of http client, which conflicts with {@see NetworkFeignClientExecutorInterceptor}
 */
declare class NetworkClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    private networkStatusListener;
    private noneNetworkHandler;
    private networkStatus;
    private tryWaitNetworkCount;
    private spinWaitMaxTimes;
    constructor(networkStatusListener: NetworkStatusListener, noneNetworkHandler?: NoneNetworkFailBack<T>, tryWaitNetworkCount?: number, spinWaitMaxTimes?: number);
    interceptor: (req: T) => Promise<T>;
    private initNetwork;
    private handleFailBack;
    /**
     * try spin wait network
     */
    private trySpinWait;
}

/**
 * default network fail back
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
declare class DefaultNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {
    private onNetworkCloseMessage;
    constructor(onNetworkCloseMessage?: string);
    onNetworkActive: () => void;
    onNetworkClose: <T_1>(request: T_1) => Promise<never>;
}

/**
 * simple network status listener
 *
 * The current request is suspended when the network status is unavailable, waiting for a while, and the request is continued after the network is restored.
 * {@see SimpleNoneNetworkFailBack#maxWaitTime}
 * {@see SimpleNoneNetworkFailBack#maxWaitLength}
 */
declare class SimpleNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {
    /**
     * 等待队列
     */
    private waitQueue;
    /**
     * 最大的等待时长
     */
    private maxWaitTime;
    /**
     * 最大的等待队列大小
     */
    private maxWaitLength;
    /**
     * @param maxWaitTime
     * @param maxWaitLength
     */
    constructor(maxWaitTime?: number, maxWaitLength?: number);
    onNetworkActive: () => (Promise<void> | void);
    onNetworkClose: (request: T) => (Promise<any> | any);
    private addWaitItem;
    /**
     * 尝试移除无效的项
     */
    private tryRemoveInvalidItem;
    private rejectHttpRequest;
}

/**
 * It needs to be configured first in the {@see FeignClientExecutorInterceptor} list
 *
 * Network interception interceptor during the execution of feign client, which conflicts with {@see NetworkClientHttpRequestInterceptor}
 */
declare class NetworkFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> extends NetworkClientHttpRequestInterceptor<any> implements FeignClientExecutorInterceptor<T> {
    constructor(networkStatusListener: NetworkStatusListener, noneNetworkHandler?: NoneNetworkFailBack<HttpRequest>, tryWaitNetworkCount?: number, spinWaitMaxTimes?: number);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => E;
    preHandle: <T_1>(options: T_1) => Promise<any>;
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
    constructor(encoders?: HttpRequestDataEncoder<T>[], decoders?: HttpResponseDataDecoder[]);
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

/**
 * feign client builder
 */
interface FeignClientBuilderInterface<T extends FeignProxyClient = FeignProxyClient> {
    build: FeignClientBuilderFunction<T>;
}
declare type FeignClientBuilderFunction<T extends FeignProxyClient = FeignProxyClient> = (client: T) => T;
declare type FeignClientBuilder<T extends FeignProxyClient = FeignProxyClient> = FeignClientBuilderFunction<T> | FeignClientBuilderInterface<T>;

declare const registry: {
    setDefaultFeignConfiguration(configuration: FeignConfiguration): void;
    getDefaultFeignConfiguration(): FeignConfiguration;
    setFeignClientBuilder(feignClientBuilder: FeignClientBuilder): void;
    getFeignClientBuilder(): FeignClientBuilder;
};

/**
 *  * Enumeration of HTTP status codes.
 */
declare enum HttpStatus {
    /**
     * {@code 100 Continue}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.2.1">HTTP/1.1: Semantics and Content, section 6.2.1</a>
     */
    /**
     * {@code 200 OK}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.1">HTTP/1.1: Semantics and Content, section 6.3.1</a>
     */
    OK = 200,
    /**
     * {@code 201 Created}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.2">HTTP/1.1: Semantics and Content, section 6.3.2</a>
     */
    CREATED = 201,
    /**
     * {@code 202 Accepted}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.3">HTTP/1.1: Semantics and Content, section 6.3.3</a>
     */
    ACCEPTED = 202,
    /**
     * {@code 203 Non-Authoritative Information}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.4">HTTP/1.1: Semantics and Content, section 6.3.4</a>
     */
    NON_AUTHORITATIVE_INFORMATION = 203,
    /**
     * {@code 204 No Content}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.5">HTTP/1.1: Semantics and Content, section 6.3.5</a>
     */
    NO_CONTENT = 204,
    /**
     * {@code 205 Reset Content}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.3.6">HTTP/1.1: Semantics and Content, section 6.3.6</a>
     */
    RESET_CONTENT = 205,
    /**
     * {@code 206 Partial Content}.
     * @see <a href="https://tools.ietf.org/html/rfc7233#section-4.1">HTTP/1.1: Range Requests, section 4.1</a>
     */
    PARTIAL_CONTENT = 206,
    /**
     * {@code 207 Multi-Status}.
     * @see <a href="https://tools.ietf.org/html/rfc4918#section-13">WebDAV</a>
     */
    /**
     * {@code 400 Bad Request}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.1">HTTP/1.1: Semantics and Content, section 6.5.1</a>
     */
    BAD_REQUEST = 400,
    /**
     * {@code 401 Unauthorized}.
     * @see <a href="https://tools.ietf.org/html/rfc7235#section-3.1">HTTP/1.1: Authentication, section 3.1</a>
     */
    UNAUTHORIZED = 401,
    /**
     * {@code 402 Payment Required}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.2">HTTP/1.1: Semantics and Content, section 6.5.2</a>
     */
    PAYMENT_REQUIRED = 402,
    /**
     * {@code 403 Forbidden}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.3">HTTP/1.1: Semantics and Content, section 6.5.3</a>
     */
    FORBIDDEN = 403,
    /**
     * {@code 404 Not Found}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.4">HTTP/1.1: Semantics and Content, section 6.5.4</a>
     */
    NOT_FOUND = 404,
    /**
     * {@code 405 Method Not Allowed}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.5">HTTP/1.1: Semantics and Content, section 6.5.5</a>
     */
    METHOD_NOT_ALLOWED = 405,
    /**
     * {@code 406 Not Acceptable}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.5.6">HTTP/1.1: Semantics and Content, section 6.5.6</a>
     */
    /**
     * {@code 500 Internal Server Error}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.1">HTTP/1.1: Semantics and Content, section 6.6.1</a>
     */
    INTERNAL_SERVER_ERROR = 500,
    /**
     * {@code 501 Not Implemented}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.2">HTTP/1.1: Semantics and Content, section 6.6.2</a>
     */
    NOT_IMPLEMENTED = 501,
    /**
     * {@code 502 Bad Gateway}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.3">HTTP/1.1: Semantics and Content, section 6.6.3</a>
     */
    BAD_GATEWAY = 502,
    /**
     * {@code 503 Service Unavailable}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.4">HTTP/1.1: Semantics and Content, section 6.6.4</a>
     */
    SERVICE_UNAVAILABLE = 503,
    /**
     * {@code 504 Gateway Timeout}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.5">HTTP/1.1: Semantics and Content, section 6.6.5</a>
     */
    GATEWAY_TIMEOUT = 504,
    /**
     * {@code 505 HTTP Version Not Supported}.
     * @see <a href="https://tools.ietf.org/html/rfc7231#section-6.6.6">HTTP/1.1: Semantics and Content, section 6.6.6</a>
     */
    HTTP_VERSION_NOT_SUPPORTED = 505
}

/**
 * default api module name
 */
declare const defaultApiModuleName = "default";
/**
 * http header content type name
 */
declare const contentTypeName = "Content-Type";
/**
 * http header content length name
 */
declare const contentLengthName = "Content-Length";
/**
 * http header content transfer encoding name
 */
declare const contentTransferEncodingName = "Content-Transfer-Encoding";
/**
 * feign client metadata key
 */
declare const FEIGN_CLINE_META_KEY = "FEIGN";
/**
 *
 */
declare const matchUrlPathVariable: RegExp;
/**
 * grab shaped like example '1{abc}2ll3{efg}' string  ==> abc, efg
 */
declare const grabUrlPathVariable: RegExp;
/**
 * mock unauthorized response
 */
declare const UNAUTHORIZED_RESPONSE: {
    ok: boolean;
    statusCode: HttpStatus;
    statusText: any;
};

/**
 * 通过请求上下文id 获取FeignClientMethodConfig
 * @param req
 * {@link REQUEST_NUM}
 * {@link appendRequestContextId}
 * {@link REQUEST_ID_HEADER_NAME}
 * {@link FeignClientMethodConfig}
 */
declare const getFeignClientMethodConfigurationByRequest: (req: HttpRequest) => Readonly<FeignClientMethodConfig>;

interface HttpHeader {
    name: string;
    value: string;
}
/**
 * use match interceptor is execute
 */
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
     * @param headers
     */
    matchesHeaders: (headers: Record<string, string>) => boolean;
    /**
     *
     * @param matchSource  use match source
     * @param includes
     * @param excludes
     * @param predicate
     */
    private doMatch;
    private converterHeaders;
}

declare class MappedFeignClientExecutorInterceptor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions> extends MappedInterceptor implements FeignClientExecutorInterceptor<T> {
    private feignClientExecutorInterceptor;
    constructor(feignClientExecutorInterceptor: FeignClientExecutorInterceptor<T>, includePatterns?: string[], excludePatterns?: string[], includeMethods?: HttpMethod[], excludeMethods?: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    preHandle: (options: T) => any;
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => any;
    postError: (options: T, response: HttpResponse<any>) => any;
    private invokeHandle;
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
    resolve: (resp: Response) => HttpResponse;
}

/**
 * 简单的请求头解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成请求头
 */
declare const simpleRequestHeaderResolver: RequestHeaderResolver;

/**
 * restful request url resolver
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
declare const voidResponseExtractor: (response: HttpResponse) => Promise<void>;
/**
 * object response extractor
 * @param response
 */
declare const objectResponseExtractor: ResponseExtractor<any>;
/**
 * head response extractor
 * @param response
 */
declare const headResponseExtractor: (response: HttpResponse) => Promise<Record<string, string>>;
/**
 * options method response extractor
 * @param response
 */
declare const optionsMethodResponseExtractor: (response: HttpResponse) => Promise<HttpMethod[]>;

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
 * process bar executor
 */
declare class ProcessBarExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    /**
     * 进度条计数器，用于在同时发起多个请求时，
     * 统一控制加载进度条
     */
    private count;
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
    postError: (options: T, response: HttpResponse<any>) => Promise<HttpResponse<any>>;
    protected needShowProcessBar: (options: T) => boolean;
}

/**
 * unified failure toast
 * @param response
 */
declare type UnifiedFailureToast = (response: HttpResponse | string) => void | Promise<void>;
declare type FeignUIToastFunction = (message: string) => Promise<void> | void;
interface FeignUIToastInterface {
    toast: FeignUIToastFunction;
}
declare type FeignUIToast = FeignUIToastFunction | FeignUIToastInterface;
declare class FeignUIToastHolder {
    static feignUIToast: FeignUIToast;
    static getFeignUIToast: () => FeignUIToastInterface;
    static setFeignUIToast: (feignUIToast: FeignUIToast) => FeignUIToast;
}

/**
 * unified transform failure toast
 */
declare class UnifiedFailureToastExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    /**
     * @deprecated
     * {@see AuthenticationBroadcaster}
     */
    private static IS_TO_AUTHENTICATION_VIEW;
    protected unifiedFailureToast: UnifiedFailureToast;
    /**
     * jump authentication view
     * @deprecated
     * {@see AuthenticationBroadcaster}
     */
    protected toAuthenticationViewHandle: Function;
    constructor(unifiedFailureToast?: UnifiedFailureToast, toAuthenticationViewHandle?: Function);
    postError: (options: T, response: HttpResponse<any>) => HttpResponse<any> | Promise<never>;
    protected tryToast: (options: T, response: HttpResponse) => void;
    private tryHandleUnAuthorized;
}

/**
 * file upload progressbar
 */
interface FileUploadProgressBar extends RequestProgressBar<FileUploadProgressBarOptions> {
    /**
     *
     * @param progress  upload progress
     * @param fileIndex
     */
    onUploadProgressChange: (progress: number, fileIndex: number) => void;
}

interface FileUploadStrategyResultInterface {
    url: string;
}
declare type FileUploadStrategyResult = FileUploadStrategyResultInterface | string;
/**
 * file upload strategy
 * Used to automatically upload files when requested and convert them to urls
 * {@see HttpRequestDataEncoder}
 */
interface FileUploadStrategy<T> {
    /**
     * upload file
     * @param file object
     * @param index
     * @param request
     * @return  default file remote url
     */
    upload: (file: T, index: number, request: FeignRequestOptions) => Promise<FileUploadStrategyResult>;
    /**
     * 文件上传 {@link FileUploadProgressBar}
     */
    fileUploadProgressBar: Readonly<FileUploadProgressBar>;
}

/**
 * abstract request file object
 */
declare abstract class AbstractRequestFileObjectEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {
    /**
     * 文件上传策略
     */
    protected fileUploadStrategy: FileUploadStrategy<any>;
    /**
     * 支持的请求方法列表
     */
    protected static SUPPORT_REQUEST_METHODS: HttpMethod[];
    constructor(fileUploadStrategy: FileUploadStrategy<any>);
    encode(request: T): Promise<T>;
    /**
     * 获取文件上传队列
     * @param data
     * @param fileUploadOptions
     */
    protected getUploadQueue: (data: any, fileUploadOptions: any) => Array<{
        key: string;
        isArray: boolean;
        value: any[];
    }>;
    /**
     * 上传
     * @param value
     * @param index
     * @param request
     */
    protected uploadFile: (value: any, index: number, request: Readonly<T>) => Promise<string>;
    /**
     * 判断请求body中的属性是否需要进行文件上传
     */
    abstract attrIsNeedUpload: (name: string, value: any, options: AutoFileUploadOptions) => boolean;
}

/**
 * determine if two HttpMediaTypes are the same
 * @param type1
 * @param type2
 */
declare const mediaTypeIsEq: (type1: HttpMediaType | string, type2: HttpMediaType | string) => boolean;
declare const responseIsJson: (headers: Record<string, string>) => boolean;
declare const responseIsText: (headers: Record<string, string>) => boolean;
declare const responseIsFile: (headers: Record<string, string>) => boolean;

/**
 * request method is support request body
 * @param method
 */
declare const supportRequestBody: (method: HttpMethod | string) => boolean;
/**
 * serialize http request body for content type
 *
 * @param method
 * @param body
 * @param contentType
 * @param filterNoneValue  filter none value
 */
declare const serializeRequestBody: (method: string, body: HttpRequestBody | string, contentType: HttpMediaType, filterNoneValue?: boolean) => string;
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
declare const invokeFunctionInterface: <T, I>(handle: T | I) => I;

declare class AsyncClientRequestDataValidator implements ClientRequestDataValidator {
    validate: <T>(requestData: T, descriptor: Partial<{ [key in keyof T]: RuleItem; }>, options?: ValidateInvokeOptions | false) => Promise<T>;
}

declare class ClientRequestDataValidatorHolder {
    private static clientRequestDataValidator;
    static setClientRequestDataValidator: (clientRequestDataValidator: ClientRequestDataValidator) => void;
    static validate: <T>(requestData: T, descriptor: Partial<{ [key in keyof T]: RuleItem; }>, options?: ValidateInvokeOptions | false) => Promise<T>;
}

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
    protected authenticationStrategy: AuthenticationStrategy;
    protected authenticationBroadcaster: AuthenticationBroadcaster;
    protected restTemplate: RestOperations;
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];
    protected defaultRequestContextOptions: FeignRequestContextOptions;
    protected defaultHeaders: Record<string, string>;
    constructor(apiService: T);
    invoke: (methodName: string, ...args: any[]) => Promise<any>;
    private init;
    private preHandle;
    private postHandle;
    private postHandleError;
    private getInterceptorHandle;
    /**
     * try check authorized status
     * @param methodName
     */
    private tryCheckAuthorizedStatus;
}

/**
 * custom enum interface for java
 */
interface Enum {
    /**
     * name
     */
    name: string;
    /**
     * index
     */
    ordinal: number;
    /**
     * desc
     */
    desc?: string;
    /**
     * extra prop
     */
    [extraProp: string]: any;
}

export { AbstractHttpClient, AbstractRequestFileObjectEncoder, ApiSignatureStrategy, AsyncClientRequestDataValidator, AuthenticationBroadcaster, AuthenticationClientHttpRequestInterceptor, AuthenticationStrategy, AuthenticationToken, AuthenticationType, AutoFileUploadOptions, CacheAuthenticationStrategy, CacheCapableAuthenticationStrategy, ClientHttpRequestInterceptor, ClientHttpRequestInterceptorFunction, ClientHttpRequestInterceptorInterface, ClientRequestDataValidator, ClientRequestDataValidatorHolder, CodecFeignClientExecutorInterceptor, CommonResolveHttpResponse, DataObfuscation, DateConverter, DateEncoder, DebounceAuthenticationBroadcaster, DefaultFeignClientBuilder, DefaultFeignClientExecutor, DefaultHttpClient, DefaultNoneNetworkFailBack as DefaultNetworkStatusListener, DefaultUriTemplateHandler, DeleteMapping, Enum, FEIGN_CLINE_META_KEY, Feign, FeignClient, FeignClientBuilder, FeignClientBuilderFunction, FeignClientBuilderInterface, FeignClientExecutor, FeignClientExecutorInterceptor, FeignClientMethodConfig, FeignConfiguration, registry as FeignConfigurationRegistry, FeignOptions, FeignProxyClient, FeignRequestBaseOptions, FeignRequestContextOptions, FeignRequestId, FeignRequestOptions, FeignRetry, FeignUIToast, FeignUIToastFunction, FeignUIToastHolder, FeignUIToastInterface, FileUpload, FileUploadProgressBar, FileUploadProgressBarOptions, FileUploadStrategy, FileUploadStrategyResult, FileUploadStrategyResultInterface, GenerateAnnotationMethodConfig, GetMapping, HttpAdapter, HttpClient, HttpMediaType, HttpMethod, HttpRequest, HttpRequestBody, HttpRequestDataEncoder, HttpResponse, HttpResponseDataDecoder, HttpRetryOptions, HttpStatus, MappedClientHttpRequestInterceptor, MappedFeignClientExecutorInterceptor, MappedInterceptor, NEVER_REFRESH_FLAG, NetworkClientHttpRequestInterceptor, NetworkFeignClientExecutorInterceptor, NetworkStatus, NetworkStatusListener, NetworkType, NoneNetworkFailBack, PatchMapping, PostMapping, ProcessBarExecutorInterceptor, ProgressBarOptions, PutMapping, QueryParamType, RequestHeaderResolver, RequestMapping, RequestProgressBar, RequestURLResolver, ResolveHttpResponse, ResponseErrorHandler, ResponseErrorHandlerFunction, ResponseErrorHandlerInterFace, ResponseExtractor, ResponseExtractorFunction, ResponseExtractorInterface, RestOperations, RestTemplate, RetryHttpClient, RoutingClientHttpRequestInterceptor, Signature, SimpleApiSignatureStrategy, SimpleNoneNetworkFailBack as SimpleNetworkStatusListener, UIOptions, UNAUTHORIZED_RESPONSE, UnifiedFailureToast, UnifiedFailureToastExecutorInterceptor, UriTemplateHandler, UriTemplateHandlerFunction, UriTemplateHandlerInterface, UriVariable, ValidateInvokeOptions, ValidatorDescriptor, contentLengthName, contentTransferEncodingName, contentTypeName, defaultApiModuleName, defaultFeignClientBuilder, defaultGenerateAnnotationMethodConfig, defaultUriTemplateFunctionHandler, filterNoneValueAndNewObject, getFeignClientMethodConfigurationByRequest, grabUrlPathVariable, headResponseExtractor, invokeFunctionInterface, matchUrlPathVariable, mediaTypeIsEq, objectResponseExtractor, optionsMethodResponseExtractor, queryStringify, responseIsFile, responseIsJson, responseIsText, restfulRequestURLResolver, serializeRequestBody, simpleRequestHeaderResolver, simpleRequestURLResolver, stringDateConverter, supportRequestBody, timeStampDateConverter, voidResponseExtractor };
