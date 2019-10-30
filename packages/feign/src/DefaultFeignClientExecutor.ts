import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestOptions} from "./FeignRequestOptions";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {RestOperations} from "./template/RestOperations";
import RetryHttpClient from "./client/RetryHttpClient";
import FeignClientExecutorInterceptorExecutor from "./FeignClientExecutorInterceptorExecutor";

/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {

    protected apiService: T;

    //url 解析
    protected requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    //请求头解析
    protected requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    //签名策略
    protected apiSignatureStrategy: ApiSignatureStrategy;

    protected restTemplate: RestOperations;

    protected feignClientExecutorInterceptorExecutor: FeignClientExecutorInterceptorExecutor;


    constructor(apiService: T) {
        this.apiService = apiService;
        const feignOptions = apiService.feignOptions;
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getFeignClientExecutorInterceptorExecutor
        } = feignOptions.configuration[0];
        this.restTemplate = getRestTemplate();
        this.feignClientExecutorInterceptorExecutor = getFeignClientExecutorInterceptorExecutor();
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
            requestHeaderResolver,
            feignClientExecutorInterceptorExecutor
        } = this;

        //原始参数
        const originalParameter = args[0] || {};
        //解析参数，进行值复制（浅拷贝）
        const requestBody = {...originalParameter};
        const options: FeignRequestOptions = args[1] || {};

        //解析url
        const requestURL = requestURLResolver(apiService, methodName);
        //处理请求头
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
        feignRequestOptions = await feignClientExecutorInterceptorExecutor.preHandle(feignRequestOptions);

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
            // error
            httpResponse = e;
        }

        //post handle
        return await feignClientExecutorInterceptorExecutor.postHandle(feignRequestOptions, httpResponse);

    };


}
