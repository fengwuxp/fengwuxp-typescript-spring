import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestBaseOptions, FeignRequestOptions} from "./FeignRequestOptions";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {RestOperations} from "./template/RestOperations";
import RetryHttpClient from "./client/RetryHttpClient";
import {FeignClientExecutorInterceptor} from "./FeignClientExecutorInterceptor";
import MappedFeignClientExecutorInterceptor from "./interceptor/MappedFeignClientExecutorInterceptor";
import {RequestMappingOptions} from "./annotations/mapping/Mapping";
import {restResponseExtractor} from "./template/RestResponseExtractor";
import {filterNoneValueAndNewObject, supportRequestBody} from "./utils/SerializeRequestBodyUtil";

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

    // default request options
    protected defaultRequestOptions: FeignRequestOptions;

    constructor(apiService: T) {
        this.apiService = apiService;
        const feignOptions = apiService.feignOptions;
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptors,
            getDefaultFeignRequestOptions
        } = feignOptions.configuration[0];
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
        if (getDefaultFeignRequestOptions) {
            this.defaultRequestOptions = getDefaultFeignRequestOptions();
        }
    }

    invoke = async (methodName: string, ...args): Promise<any> => {


        const {
            apiSignatureStrategy,
            restTemplate,
            apiService,
            requestURLResolver,
            requestHeaderResolver,
            defaultRequestOptions
        } = this;

        //原始参数
        const originalParameter = args[0] || {};
        let feignRequestOptions: FeignRequestOptions = {
            ...args[1],
            ...defaultRequestOptions
        };
        // resolver request body，filter none value in request body or copy value
        const requestBody = feignRequestOptions.filterNoneValue ? filterNoneValueAndNewObject(originalParameter) : {...originalParameter};
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
            httpResponse = e;
        }

        //post handle
        return await this.postHandle(requestURL, requestMapping, feignRequestOptions, httpResponse);

    };


    private preHandle = async (options: FeignRequestBaseOptions, url: string, requestMapping: RequestMappingOptions) => {

        const {feignClientExecutorInterceptors} = this;
        let result: FeignRequestBaseOptions = options, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            if (feignClientExecutorInterceptor instanceof MappedFeignClientExecutorInterceptor) {
                if (!feignClientExecutorInterceptor.matches({
                    url,
                    method: requestMapping.method,
                    headers: requestMapping.headers,
                    timeout: requestMapping.timeout
                })) {
                    continue;
                }
            }
            result = await feignClientExecutorInterceptor.preHandle(result);
            index++;
        }

        return result;
    };

    private postHandle = async <E = any>(url: string, requestMapping: RequestMappingOptions, options: FeignRequestBaseOptions, response: E): Promise<any> => {
        const {feignClientExecutorInterceptors} = this;
        let result: any = response, len = feignClientExecutorInterceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = feignClientExecutorInterceptors[index];
            if (feignClientExecutorInterceptor instanceof MappedFeignClientExecutorInterceptor) {
                if (!feignClientExecutorInterceptor.matches({
                    url,
                    method: requestMapping.method,
                    headers: requestMapping.headers,
                    timeout: requestMapping.timeout
                })) {
                    continue;
                }
            }
            result = await feignClientExecutorInterceptor.postHandle(options, result);
            index++;
        }

        return result;
    };


}