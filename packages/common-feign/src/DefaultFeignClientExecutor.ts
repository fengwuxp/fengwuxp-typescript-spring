import {FeignClientExecutor} from "./FeignClientExecutor";
import {FeignProxyClient} from "./support/FeignProxyClient";
import {FeignOptions} from "./annotations/Feign";
import {RequestURLResolver} from "./resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
import {ApiSignatureStrategy} from "./signature/ApiSignatureStrategy";
import {FeignRequestBaseOptions, FeignRequestOptions, FeignRetryRequestOptions} from "./FeignRequestOptions";
import RestTemplate from "./template/RestTemplate";
import {url} from "inspector";


export default class DefaultFeignClientExecutor implements FeignClientExecutor {

    //url 解析
    protected requestURLResolver: RequestURLResolver;

    //请求头解析
    protected requestHeaderResolver: RequestHeaderResolver;

    //签名策略
    protected apiSignatureStrategy: ApiSignatureStrategy;


    protected restTemplate: RestTemplate;


    execute = (apiService: FeignProxyClient, methodName: string, ...args): Promise<any> => {

        // const serviceMethod: Function = apiService[methodName];
        // if (serviceMethod) {
        //     //execute method @see {@link ./support/GenerateAnnotationMethodConfig.ts}
        //     serviceMethod.apply(apiService, [...args]);
        // }

        //原始参数
        const originalParameter = args[0] || {};
        //解析参数，进行值复制（浅拷贝）
        const requestBody = {...originalParameter};
        const options: FeignRequestOptions = args[1] || {};

        //解析url
        const requestURL = this.requestURLResolver(apiService, methodName);
        //处理请求头
        let headers = this.requestHeaderResolver(apiService, methodName, options.headers, requestBody) || {};
        const queryParams = options.queryParams;
        if (queryParams) {
            headers = this.requestHeaderResolver(apiService, methodName, options.headers, queryParams);
        }

        //请求requestMapping
        const serviceMethodConfig = apiService.getFeignMethodConfig(methodName);
        const {requestMapping, signature, retryOptions} = serviceMethodConfig;

        //解析参数生成 options，并提交请求
        const fetchOptions: FeignRequestOptions = {
            ...options,
            headers,
            body: requestBody
        };

        if (this.apiSignatureStrategy != null) {
            //签名处理
            const signFields = signature != null ? signature.fields : null;
            this.apiSignatureStrategy.sign(signFields, originalParameter, fetchOptions);
        }

        if (retryOptions) {
            //需要重试
            (fetchOptions as FeignRetryRequestOptions).retryOptions = retryOptions;
        }

        //TODO 前置处理
        // 1: 处理请求进度条的控制
        // 2: 处理请求参数，包括无效参数过滤，文件类型参数转换


        const httpResponse = this.restTemplate.execute(
            requestURL,
            requestMapping.method,
            fetchOptions.queryParams,
            fetchOptions.body,
            fetchOptions.responseExtractor,
            fetchOptions.headers);


        //TODO 后置处理
        // 1：关闭请求请求进度条
        // 2：进行统一响应处理，如错误提示等

        return null;

    };


}
