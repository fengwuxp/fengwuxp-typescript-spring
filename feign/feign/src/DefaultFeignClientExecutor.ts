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
import {HttpResponse} from "./client/HttpResponse";

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    protected apiService: T;

    // url 解析
    protected requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    // 请求头解析
    protected requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    // 签名策略
    protected apiSignatureStrategy: ApiSignatureStrategy;

    // res template
    protected restTemplate: RestOperations;

    // feign client executor interceptors
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];

    constructor(apiService: T) {
        this.apiService = apiService;
        const feignOptions = apiService.feignOptions;
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptors
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
    }

    invoke = async (methodName: string, ...args): Promise<any> => {


        const {
            apiSignatureStrategy,
            restTemplate,
            apiService,
            requestURLResolver,
            requestHeaderResolver
        } = this;

        //原始参数
        const originalParameter = args[0] || {};
        //解析参数，进行值复制（浅拷贝）
        const requestBody = {...originalParameter};
        const options: FeignRequestOptions = args[1] || {};

        //resolver request url
        const requestURL = requestURLResolver(apiService, methodName);
        //resolver headers
        let headers = requestHeaderResolver(apiService, methodName, options.headers, requestBody) || {};
        const queryParams = options.queryParams;
        if (queryParams) {
            headers = requestHeaderResolver(apiService, methodName, options.headers, queryParams);
        }

        //requestMapping
        const feignClientMethodConfig = apiService.getFeignMethodConfig(methodName);
        const {requestMapping, signature, retryOptions} = feignClientMethodConfig;

        //解析参数生成 feignRequestOptions
        let feignRequestOptions: FeignRequestOptions = {
            ...options,
            headers,
            body: requestBody
        };

        if (apiSignatureStrategy != null) {
            //签名处理
            const signFields = signature != null ? signature.fields : null;
            apiSignatureStrategy.sign(signFields, originalParameter, feignRequestOptions);
        }

        // pre handle
        feignRequestOptions = await this.preHandle(feignRequestOptions, requestURL, requestMapping);

        if (feignRequestOptions.responseExtractor == null) {
            feignRequestOptions.responseExtractor = restResponseExtractor(requestMapping.method);
        }

        let httpResponse: any;
        try {
            if (retryOptions) {
                // need retry
                httpResponse = await new RetryHttpClient({
                    send: (req) => {
                        return restTemplate.execute(requestURL,
                            requestMapping.method,
                            feignRequestOptions.queryParams,
                            feignRequestOptions.body,
                            feignRequestOptions.responseExtractor,
                            feignRequestOptions.headers)
                    }
                }, retryOptions).send(null);

            } else {
                httpResponse = await restTemplate.execute(
                    requestURL,
                    requestMapping.method,
                    feignRequestOptions.queryParams,
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
                }, options)) {
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
                }, options, response)) {
                    continue;
                }
            }
            result = await feignClientExecutorInterceptor.postHandle(options, result);
            index++;
        }

        return result;
    };

}
