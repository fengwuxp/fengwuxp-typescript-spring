import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestBaseOptions, FeignRequestContextOptions, FeignRequestOptions} from "./FeignRequestOptions";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {QueryParamType, RestOperations} from "./template/RestOperations";
import {FeignClientExecutorInterceptor} from "./FeignClientExecutorInterceptor";
import MappedFeignClientExecutorInterceptor from "./interceptor/MappedFeignClientExecutorInterceptor";
import {MappingHeaders, RequestMappingOptions} from "./annotations/mapping/Mapping";
import {restResponseExtractor} from "./template/RestResponseExtractor";
import {filterNoneValueAndNewObject, supportRequestBody} from "./utils/SerializeRequestBodyUtil";
import {HttpResponse} from 'client/HttpResponse';
import ClientRequestDataValidatorHolder from "./validator/ClientRequestDataValidatorHolder";
import {setRequestFeignClientMethodConfiguration, setRequestFeignConfiguration} from "./context/RequestContextHolder"
import {AuthenticationStrategy} from "./client/AuthenticationStrategy";
import {parse} from "querystring";
import {FeignHttpConfiguration} from "./configuration/FeignHttpConfiguration";
import {SupportSerializableBody} from "./client/HttpRequest";
import {HttpMethod} from "./constant/http/HttpMethod";
import {FeignClientMethodConfig} from "./support/FeignClientMethodConfig";
import Log4jFactory from "./log/DefaultFeignLo4jFactory";

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    private static LOG = Log4jFactory.getLogger(DefaultFeignClientExecutor.name);

    private readonly apiService: T;

    private feignConfiguration: Readonly<FeignHttpConfiguration>;

    // request url resolver
    private requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    // request headers resolver
    private requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    // api signature strategy
    private apiSignatureStrategy: ApiSignatureStrategy;

    // authentication strategy
    private authenticationStrategy: AuthenticationStrategy;

    // rest template
    private restTemplate: RestOperations;

    // feign client executor interceptors
    private feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];

    // default request context options
    private defaultRequestContextOptions: FeignRequestContextOptions;

    // default request headers
    private defaultHeaders: Record<string, string>;

    /**
     * 是否已经初始化
     */
    private initialized: boolean = false;

    constructor(apiService: T) {
        this.apiService = apiService;
    }

    invoke = async (methodName: string, ...args): Promise<any> => {

        // initialize config
        await this.initialize(this.apiService);

        const {requestURLResolver, restTemplate, apiService} = this;

        // original parameter
        const originalParameter = args[0] || {};

        // validate request params
        await this.validateRequestParams(originalParameter, methodName);

        //requestMapping
        const {requestMapping} = this.apiService.getFeignMethodConfig(methodName);

        // resolver request url
        const requestURL = requestURLResolver(apiService, methodName);
        let feignRequestOptions = this.buildFeignRequest(originalParameter, args[1], methodName);

        if (DefaultFeignClientExecutor.LOG.isDebugEnabled()) {
            DefaultFeignClientExecutor.LOG.debug(`
                          requestUrl: ${requestURL}
                          requestParams: ${JSON.stringify(feignRequestOptions.queryParams)}
                          requestHeaders: ${JSON.stringify(feignRequestOptions.headers)}
                          requestBody: ${JSON.stringify(feignRequestOptions.body)}`);
        }

        // pre handle
        feignRequestOptions = await this.preHandle(feignRequestOptions, requestURL, requestMapping);

        let httpResponse: any;
        try {
            httpResponse = await restTemplate.execute(
                requestURL,
                requestMapping.method,
                feignRequestOptions.queryParams,
                feignRequestOptions.body,
                feignRequestOptions.responseExtractor,
                feignRequestOptions.headers,
                feignRequestOptions);
        } catch (error) {
            if (DefaultFeignClientExecutor.LOG.isDebugEnabled()) {
                DefaultFeignClientExecutor.LOG.debug("request error, request url: %O", requestURL, error);
            }
            // Non 2xx response
            const result = await this.postHandleError(requestURL, requestMapping, feignRequestOptions, error as any);
            return Promise.reject(result);
        }

        // post handle
        return this.postHandle(requestURL, requestMapping, feignRequestOptions, httpResponse);
    };

    /**
     *  init feign client executor
     * @param apiService
     */
    private initialize = async (apiService: T) => {
        if (this.initialized) {
            return;
        }
        this.feignConfiguration = await apiService.feignConfiguration<FeignHttpConfiguration>();
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptors,
            getDefaultFeignRequestContextOptions,
            getDefaultHttpHeaders,
            getAuthenticationStrategy
        } = this.feignConfiguration;

        this.restTemplate = getRestTemplate();
        this.feignClientExecutorInterceptors = getFeignClientExecutorInterceptors();
        if (getApiSignatureStrategy) {
            this.apiSignatureStrategy = getApiSignatureStrategy();
        }
        if (getRequestURLResolver) {
            this.requestURLResolver = getRequestURLResolver();
        }
        if (getRequestHeaderResolver) {
            this.requestHeaderResolver = getRequestHeaderResolver();
        }
        if (getDefaultFeignRequestContextOptions) {
            this.defaultRequestContextOptions = getDefaultFeignRequestContextOptions();
        }

        if (getAuthenticationStrategy) {
            this.authenticationStrategy = getAuthenticationStrategy();
        }

        if (getDefaultHttpHeaders) {
            this.defaultHeaders = getDefaultHttpHeaders() ?? {};
        } else {
            this.defaultHeaders = {};
        }

        this.initialized = true;
    }

    private preHandle = async (options: FeignRequestBaseOptions, url: string, requestMapping: RequestMappingOptions): Promise<FeignRequestBaseOptions> => {
        const {feignClientExecutorInterceptors} = this;

        let result: FeignRequestBaseOptions = options, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            const handle = this.getInterceptorHandle(
                feignClientExecutorInterceptor,
                feignClientExecutorInterceptor.preHandle,
                () => options,
                url,
                options,
                requestMapping);
            result = await handle(result);
            index++;
        }

        return result;
    };

    private postHandle = async <E = any>(url: string, requestMapping: RequestMappingOptions, options: FeignRequestBaseOptions, response: E): Promise<any> => {
        const {feignClientExecutorInterceptors} = this;
        let result: any = response, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            const handle = this.getInterceptorHandle(
                feignClientExecutorInterceptor,
                feignClientExecutorInterceptor.postHandle,
                () => result,
                url,
                options,
                requestMapping);
            result = await handle(options, result);
            index++;
        }
        return result;
    };

    private postHandleError = async (url: string, requestMapping: RequestMappingOptions, options: FeignRequestBaseOptions, response: HttpResponse) => {
        const {feignClientExecutorInterceptors} = this;
        let result: any = response, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            const handle = this.getInterceptorHandle(
                feignClientExecutorInterceptor,
                feignClientExecutorInterceptor.postError,
                () => result,
                url,
                options,
                requestMapping);
            try {
                result = await handle(options, result);
            } catch (e) {
                result = e;
            }
            index++;
        }
        return Promise.reject(result);
    };

    private getInterceptorHandle = (feignClientExecutorInterceptor,
                                    handle: Function,
                                    isNotHandle: Function,
                                    url: string,
                                    options: FeignRequestBaseOptions,
                                    requestMapping: RequestMappingOptions): Function => {
        if (typeof handle != "function") {
            return isNotHandle;
        }

        if (feignClientExecutorInterceptor instanceof MappedFeignClientExecutorInterceptor) {
            let isMatch = feignClientExecutorInterceptor.matches({
                url,
                method: requestMapping.method,
                headers: options.headers,
                timeout: requestMapping.timeout,
                attributes: options.attributes
            });
            if (!isMatch) {
                return isNotHandle;
            }
            return handle;
        }
        return handle;
    }

    private validateRequestParams = (requestParameter, methodName: string): Promise<void> => {
        const validateSchemaOptions = this.apiService.getFeignMethodConfig(methodName).validateSchemaOptions;
        if (validateSchemaOptions == null) {
            return Promise.resolve();
        }

        // request data validate
        return ClientRequestDataValidatorHolder.validate(requestParameter, validateSchemaOptions).catch(error => {
            // validate error
            DefaultFeignClientExecutor.LOG.debug("validate request params failure, request: %O", requestParameter, error);
            return Promise.reject(error);
        });
    }

    private buildFeignRequest = (originalParameter: any, options: FeignRequestOptions, methodName: string): FeignRequestOptions => {
        const {defaultRequestContextOptions, apiService, apiSignatureStrategy} = this;
        const feignMethodConfig = apiService.getFeignMethodConfig(methodName);
        const {requestMapping, signature} = feignMethodConfig;

        const feignRequest: FeignRequestOptions = {
            ...options,
            ...defaultRequestContextOptions
        };
        feignRequest.queryParams = this.resolveQueryPrams(feignRequest.queryParams ?? {}, requestMapping.params ?? {});
        feignRequest.body = this.resolveRequestBody(requestMapping.method, originalParameter, feignRequest.filterNoneValue,);
        feignRequest.headers = this.resolverRequestHeaders(feignRequest, methodName);

        if (apiSignatureStrategy != null) {
            // handle api signature
            const signFields = signature != null ? signature.fields : null;
            apiSignatureStrategy.sign(signFields, originalParameter, feignRequest);
        }

        if (feignRequest.responseExtractor == null) {
            // get response extractor
            feignRequest.responseExtractor = restResponseExtractor(requestMapping.method);
        }

        // init request context
        feignRequest.attributes = {};
        this.configureRequestContext(feignRequest, feignMethodConfig);

        return feignRequest;
    }

    private resolveRequestBody = (httpMethod: HttpMethod, originalParameter: any, filterNoneValue: boolean): SupportSerializableBody => {
        if (supportRequestBody(httpMethod)) {
            // resolver request body，filter none value in request body or copy value
            return filterNoneValue === false ? {...originalParameter} : filterNoneValueAndNewObject(originalParameter);
        }
        return undefined;
    }

    private resolveQueryPrams = (queryParams: QueryParamType, requestMappingParams: MappingHeaders | string[]) => {
        return {
            // 合并默认参数
            ...this.resolveRequestMappingParams(requestMappingParams),
            ...queryParams
        };
    }

    private resolveRequestMappingParams = (requestMappingParams: MappingHeaders | string[]) => {
        if (Array.isArray(requestMappingParams)) {
            return requestMappingParams.map((queryString) => {
                return parse(queryString);
            }).reduce((previousValue, currentValue) => {
                return {
                    ...previousValue,
                    ...currentValue
                }
            }, {});
        }
        return requestMappingParams;
    }

    private resolverRequestHeaders = (feignRequestOptions: FeignRequestOptions, methodName: string) => {
        const {apiService, defaultHeaders, requestHeaderResolver} = this;
        // resolver headers
        const {headers, body, queryParams} = feignRequestOptions;
        const requestHeaders = requestHeaderResolver(apiService, methodName, headers, body as object);
        return {
            ...defaultHeaders,
            ...requestHeaderResolver(apiService, methodName, requestHeaders, queryParams)
        }
    }

    private configureRequestContext(feignRequest: FeignRequestOptions, feignMethodConfig: Readonly<FeignClientMethodConfig>) {
        // set mapping options
        setRequestFeignClientMethodConfiguration(feignRequest, feignMethodConfig);
        setRequestFeignConfiguration(feignRequest, this.feignConfiguration);
    }
}
