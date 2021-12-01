import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestBaseOptions, FeignRequestContextOptions, FeignRequestOptions} from "./FeignRequestOptions";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {RestOperations} from "./template/RestOperations";
import {FeignClientExecutorInterceptor} from "./FeignClientExecutorInterceptor";
import MappedFeignClientExecutorInterceptor from "./interceptor/MappedFeignClientExecutorInterceptor";
import {RequestMappingOptions} from "./annotations/mapping/Mapping";
import {restResponseExtractor} from "./template/RestResponseExtractor";
import {filterNoneValueAndNewObject, supportRequestBody} from "./utils/SerializeRequestBodyUtil";
import {HttpResponse} from 'client/HttpResponse';
import ClientRequestDataValidatorHolder from "./validator/ClientRequestDataValidatorHolder";
import {setFeignClientMethodConfiguration} from "./context/RequestContextHolder"
import {AuthenticationStrategy} from "./client/AuthenticationStrategy";
import {parse} from "querystring";

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    private readonly apiService: T;

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
     * @protected
     */
    private initialized: boolean = false;

    constructor(apiService: T) {
        this.apiService = apiService;
    }

    invoke = async (methodName: string, ...args): Promise<any> => {
        // 初始化
        await this.init(this.apiService);
        const {
            apiSignatureStrategy,
            restTemplate,
            apiService,
            requestURLResolver,
            requestHeaderResolver,
            defaultRequestContextOptions,
            defaultHeaders,
        } = this;

        //original parameter
        const originalParameter = args[0] || {};

        const feignMethodConfig = apiService.getFeignMethodConfig(methodName);

        //requestMapping
        const {requestMapping, signature, validateSchemaOptions} = feignMethodConfig;

        if (validateSchemaOptions != null) {
            try {
                // request data validate
                await ClientRequestDataValidatorHolder.validate(originalParameter, validateSchemaOptions);
            } catch (e) {
                // validate error
                return Promise.reject(e);
            }
        }

        let feignRequestOptions: FeignRequestOptions = {
            ...args[1],
            ...defaultRequestContextOptions
        };

        // resolver request body，filter none value in request body or copy value
        const requestBody = feignRequestOptions.filterNoneValue === false ? {...originalParameter} : filterNoneValueAndNewObject(originalParameter);
        //resolver request url
        const requestURL = requestURLResolver(apiService, methodName);

        //resolver headers
        let headers = requestHeaderResolver(apiService, methodName, feignRequestOptions.headers, requestBody);
        const requestSupportRequestBody = supportRequestBody(requestMapping.method);
        let queryParams = requestSupportRequestBody ? feignRequestOptions.queryParams : requestBody;
        if (queryParams && requestSupportRequestBody) {
            headers = requestHeaderResolver(apiService, methodName, feignRequestOptions.headers, queryParams);
        }
        let defaultQueryParams = requestMapping.params;
        if (Array.isArray(defaultQueryParams)) {
            defaultQueryParams = defaultQueryParams.map((queryString) => {
                return parse(queryString);
            }).reduce((previousValue, currentValue) => {
                return {
                    ...previousValue,
                    ...currentValue
                }
            }, {});
        }
        if (defaultQueryParams != null) {
            // 合并默认参数
            queryParams = {
                ...defaultQueryParams,
                ...(queryParams || {})
            };
        }
        feignRequestOptions.queryParams = queryParams;
        feignRequestOptions.body = requestSupportRequestBody ? requestBody : null;
        feignRequestOptions.headers = {
            ...defaultHeaders,
            ...headers
        };

        if (apiSignatureStrategy != null) {
            // handle api signature
            const signFields = signature != null ? signature.fields : null;
            apiSignatureStrategy.sign(signFields, originalParameter, feignRequestOptions);
        }

        if (feignRequestOptions.responseExtractor == null) {
            // get response extractor
            feignRequestOptions.responseExtractor = restResponseExtractor(requestMapping.method);
        }

        // init request context
        feignRequestOptions.attributes = {};
        // set mapping options
        setFeignClientMethodConfiguration(feignRequestOptions, feignMethodConfig);

        // pre handle
        feignRequestOptions = await this.preHandle(feignRequestOptions, requestURL, requestMapping);

        let httpResponse: any;
        try {
            httpResponse = await restTemplate.execute(
                requestURL,
                requestMapping.method,
                queryParams,
                feignRequestOptions.body,
                feignRequestOptions.responseExtractor,
                feignRequestOptions.headers,
                feignRequestOptions);
        } catch (e) {
            // Non 2xx response
            const result = await this.postHandleError(requestURL, requestMapping, feignRequestOptions, e as any);
            return Promise.reject(result);
        }

        // post handle
        return await this.postHandle(requestURL, requestMapping, feignRequestOptions, httpResponse);
    };

    /**
     *  init feign client executor
     * @param apiService
     */
    private init = async (apiService: T) => {
        if (this.initialized) {
            return;
        }
        const configuration = await apiService.feignConfiguration();
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptors,
            getDefaultFeignRequestContextOptions,
            getDefaultHttpHeaders,
            getAuthenticationStrategy
        } = configuration;

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
            this.defaultHeaders = getDefaultHttpHeaders();
        }
        this.initialized = true;
    }


    private preHandle = async (options: FeignRequestBaseOptions, url: string, requestMapping: RequestMappingOptions) => {

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
}
