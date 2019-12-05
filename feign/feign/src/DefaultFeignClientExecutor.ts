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

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    protected apiService: T;

    // request url resolver
    protected requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    // request headers resolver
    protected requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    // api signature strategy
    protected apiSignatureStrategy: ApiSignatureStrategy;

    // rest template
    protected restTemplate: RestOperations;

    // feign client executor interceptors
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];

    // default request context options
    protected defaultRequestContextOptions: FeignRequestContextOptions;

    constructor(apiService: T) {
        this.apiService = apiService;
        const configuration = apiService.feignConfiguration();
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptors,
            getDefaultFeignRequestContextOptions
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
    }

    invoke = async (methodName: string, ...args): Promise<any> => {


        const {
            apiSignatureStrategy,
            restTemplate,
            apiService,
            requestURLResolver,
            requestHeaderResolver,
            defaultRequestContextOptions
        } = this;

        //original parameter
        const originalParameter = args[0] || {};
        let feignRequestOptions: FeignRequestOptions = {
            ...args[1],
            ...defaultRequestContextOptions
        };
        // resolver request body，filter none value in request body or copy value
        const requestBody = feignRequestOptions.filterNoneValue === false ? {...originalParameter} : filterNoneValueAndNewObject(originalParameter);
        //resolver request url
        const requestURL = requestURLResolver(apiService, methodName);

        //requestMapping
        const {requestMapping, signature, retryOptions} = apiService.getFeignMethodConfig(methodName);
        //resolver headers
        let headers = requestHeaderResolver(apiService, methodName, feignRequestOptions.headers, requestBody);
        const requestSupportRequestBody = supportRequestBody(requestMapping.method);
        const queryParams = requestSupportRequestBody ? feignRequestOptions.queryParams : requestBody;
        if (queryParams && requestSupportRequestBody) {
            headers = requestHeaderResolver(apiService, methodName, feignRequestOptions.headers, queryParams);
        }
        feignRequestOptions.body = requestSupportRequestBody ? requestBody : null;
        feignRequestOptions.headers = headers;

        if (apiSignatureStrategy != null) {
            // handle api signature
            const signFields = signature != null ? signature.fields : null;
            apiSignatureStrategy.sign(signFields, originalParameter, feignRequestOptions);
        }

        if (feignRequestOptions.responseExtractor == null) {
            // get response extractor
            feignRequestOptions.responseExtractor = restResponseExtractor(requestMapping.method);
        }

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
                            feignRequestOptions.responseExtractor,
                            req.headers);
                    }
                }, retryOptions).send({
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
                    feignRequestOptions.headers);
            }
        } catch (e) {
            // Non-2xx response
            const result = await this.postHandleError(requestURL, requestMapping, feignRequestOptions, e as any);
            return Promise.reject(result);
        }

        //post handle
        return await this.postHandle(requestURL, requestMapping, feignRequestOptions, httpResponse);

    };


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
                requestMapping);
            result = await handle(options, result);
            index++;
        }

        return result;
    };


    private postHandleError = async (url: string, requestMapping: RequestMappingOptions, options: FeignRequestBaseOptions, response: HttpResponse<any>) => {
        const {feignClientExecutorInterceptors} = this;
        let result: any = response, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            const handle = this.getInterceptorHandle(
                feignClientExecutorInterceptor,
                feignClientExecutorInterceptor.postError,
                () => result,
                url,
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
                                    requestMapping: RequestMappingOptions): Function => {
        if (typeof handle != "function") {
            return isNotHandle;
        }

        if (feignClientExecutorInterceptor instanceof MappedFeignClientExecutorInterceptor) {
            let isMatch = feignClientExecutorInterceptor.matches({
                url,
                method: requestMapping.method,
                headers: requestMapping.headers,
                timeout: requestMapping.timeout
            });
            if (!isMatch) {
                return isNotHandle;
            }
            return handle;
        }
        return handle;
    }


}
