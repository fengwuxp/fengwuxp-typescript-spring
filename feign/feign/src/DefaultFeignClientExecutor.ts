import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestBaseOptions, FeignRequestContextOptions, FeignRequestOptions} from "./FeignRequestOptions";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {RestOperations} from "./template/RestOperations";
import RetryHttpClient from "./client/RetryHttpClient";
import {FeignClientExecutorInterceptor} from "./FeignClientExecutorInterceptor";
import MappedFeignClientExecutorInterceptor from "./interceptor/MappedFeignClientExecutorInterceptor";
import {RequestMappingOptions} from "./annotations/mapping/Mapping";
import {restResponseExtractor} from "./template/RestResponseExtractor";
import {filterNoneValueAndNewObject, supportRequestBody} from "./utils/SerializeRequestBodyUtil";
import {HttpResponse} from 'client/HttpResponse';
import ClientRequestDataValidatorHolder from "./validator/ClientRequestDataValidatorHolder";
import {setFeignClientMethodConfiguration} from "./context/RequestContextHolder"
import {AuthenticationBroadcaster, AuthenticationStrategy, AuthenticationToken} from "./client/AuthenticationStrategy";
import {UNAUTHORIZED_RESPONSE} from './constant/FeignConstVar';
import {AuthenticationType} from "./constant/AuthenticationType";
import {parse} from "querystring";

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    protected readonly apiService: T;

    // request url resolver
    protected requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    // request headers resolver
    protected requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    // api signature strategy
    protected apiSignatureStrategy: ApiSignatureStrategy;

    // authentication strategy
    protected authenticationStrategy: AuthenticationStrategy;

    protected authenticationBroadcaster: AuthenticationBroadcaster;

    // rest template
    protected restTemplate: RestOperations;

    // feign client executor interceptors
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];

    // default request context options
    protected defaultRequestContextOptions: FeignRequestContextOptions;

    // default request headers
    protected defaultHeaders: Record<string, string>;

    /**
     * 是否已经初始化
     * @protected
     */
    protected initialized: boolean = false;


    constructor(apiService: T) {
        this.apiService = apiService;
    }


    invoke = async (methodName: string, ...args): Promise<any> => {
        // 初始化
        await this.init(this.apiService);
        try {
            await this.tryCheckAuthorizedStatus(methodName);
        } catch (e) {
            return Promise.reject(e);
        }

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
        const {requestMapping, signature, retryOptions, validateSchemaOptions} = feignMethodConfig;

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
            if (retryOptions) {
                // need retry
                httpResponse = await new RetryHttpClient({
                    send: (req) => {
                        return restTemplate.execute(
                            req.url,
                            req.method,
                            queryParams,
                            req.body,
                            feignRequestOptions.responseExtractor);
                    }
                }, retryOptions).send({
                    attributes: feignRequestOptions.attributes,
                    url: requestURL,
                    method: requestMapping.method,
                    body: feignRequestOptions.body,
                    headers: feignRequestOptions.headers
                });

            } else {
                httpResponse = await restTemplate.execute(
                    requestURL,
                    requestMapping.method,
                    queryParams,
                    feignRequestOptions.body,
                    feignRequestOptions.responseExtractor,
                    feignRequestOptions.headers,
                    feignRequestOptions);
            }
        } catch (e) {
            // Non-2xx response
            const result = await this.postHandleError(requestURL, requestMapping, feignRequestOptions, e as any);
            return Promise.reject(result);
        }

        //post handle
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
            getAuthenticationStrategy,
            getAuthenticationBroadcaster
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
        if (getAuthenticationBroadcaster) {
            this.authenticationBroadcaster = getAuthenticationBroadcaster();
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


    /**
     * try check authorized status
     * @param methodName
     */
    private tryCheckAuthorizedStatus = async (methodName: string) => {

        const {
            apiService,
            authenticationStrategy,
            authenticationBroadcaster
        } = this;
        const feignMethodConfig = apiService.getFeignMethodConfig(methodName);
        //requestMapping
        const {requestMapping} = feignMethodConfig;
        // need certification
        if (requestMapping.authenticationType !== AuthenticationType.FORCE) {
            return;
        }
        if (authenticationStrategy == null) {
            return;
        }
        let result: AuthenticationToken;
        try {
            result = await authenticationStrategy.getAuthorization(null);
        } catch (e) {
        }
        const noneLogin = result == null || result.expireDate <= new Date().getTime() - 5 * 1000;
        if (noneLogin) {
            // not login
            if (authenticationBroadcaster != null) {
                if (authenticationStrategy.clearCache != null) {
                    authenticationStrategy.clearCache()
                }
                // send event
                authenticationBroadcaster.sendUnAuthorizedEvent();
            }

            return Promise.reject(UNAUTHORIZED_RESPONSE);
        }
    }


}
