import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestOptions, FeignRetryRequestOptions} from "./FeignRequestOptions";
import RestTemplate from "./template/RestTemplate";
import {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
import {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
import {RestOperations} from "./template/RestOperations";
import {FeignClient} from "./FeignClient";

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


    constructor(apiService: T) {
        this.apiService = apiService;
        const feignOptions = apiService.feignOptions;
        const {
            getRestTemplate,
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver
        } = feignOptions.configuration[0];
        this.restTemplate = getRestTemplate();
        if (getApiSignatureStrategy) {
            this.apiSignatureStrategy = getApiSignatureStrategy();
        }
        if (getApiSignatureStrategy) {
            this.requestURLResolver = getRequestURLResolver();
        }
        if (getApiSignatureStrategy) {
            this.requestHeaderResolver = getRequestHeaderResolver();
        }
    }

    invoke = (methodName: string, ...args): Promise<any> => {


        const {apiSignatureStrategy, restTemplate, apiService, requestURLResolver, requestHeaderResolver} = this;

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

        //请求requestMapping
        const feignClientMethodConfig = apiService.getFeignMethodConfig(methodName);
        const {requestMapping, signature, retryOptions} = feignClientMethodConfig;

        //解析参数生成 options，并提交请求
        const feignRequestOptions: FeignRequestOptions = {
            ...options,
            headers,
            body: requestBody
        };

        if (apiSignatureStrategy != null) {
            //签名处理
            const signFields = signature != null ? signature.fields : null;
            apiSignatureStrategy.sign(signFields, originalParameter, feignRequestOptions);
        }

        if (retryOptions) {
            //需要重试
            (feignRequestOptions as FeignRetryRequestOptions).retryOptions = retryOptions;
        }

        //TODO 前置处理
        // 1: 处理请求进度条的控制
        // 2: 处理请求参数，包括无效参数过滤，文件类型参数转换


        const httpResponse = restTemplate.execute(
            requestURL,
            requestMapping.method,
            feignRequestOptions.queryParams,
            feignRequestOptions.body,
            feignRequestOptions.responseExtractor,
            feignRequestOptions.headers);


        //TODO 后置处理
        // 1：关闭请求请求进度条
        // 2：进行统一响应处理，如错误提示等

        return null;

    };


}
