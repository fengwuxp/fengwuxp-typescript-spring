import {DataObfuscationOptions} from "./annotations/security/DataObfuscation";
import {ResponseExtractor} from "./template/ResponseExtractor";
import {QueryParamType} from "./template/RestOperations";
import {HttpMediaType} from "./constant/http/HttpMediaType";
import {ValidateInvokeOptions} from "./validator/ClientRequestDataValidator";
import {ProgressBarOptions} from './ui/RequestProgressBar';
import {HttpRequestContext, SupportSerializableBody} from "./client/HttpRequest";


/**
 * Used by the feign client to pass data during the request process and the interceptor
 * {@code FeignClientExecutorInterceptor#preHandle} execution process, until the {@code RestTemplate#execute} method is called
 *
 * {@see FeignClientExecutorInterceptor#preHandle}
 * {@see RestTemplate#execute}
 */
export interface FeignRequestBaseOptions extends HttpRequestContext {


    /**
     * external query parameters
     */
    queryParams?: QueryParamType;

    /**
     * request body
     */
    body?: SupportSerializableBody;

    /**
     * external request headers
     * support '{xxx}' expression，Data can be obtained from request body or query data
     * {@see RequestHeaderResolver}
     */
    headers?: Record<string, string>;


}


export interface FileUploadProgressBarOptions extends ProgressBarOptions {

    // 文件上传进度
    // progress: number;
}

export interface FileUploadOptions {
    // [parallel] {Number} the number of parts to be uploaded in parallel
    //要并行上传的分片数量
    parallel?: number;

    //[partSize] {Number} the suggested size for each part
    //每个分片的大小
    partSize?: number;

    //[timeout] {Number} Milliseconds before a request is considered to be timed out
    //毫秒数
    timeout?: number;
}


export interface UIOptions {

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

export interface DataOptions {
    /**
     * 使用统一响应转换
     * 默认：true
     */
    useUnifiedTransformResponse?: boolean;

    /**
     * 是否过滤提交数据中的 空字符串，null的数据，数值类型的NaN
     * 默认：false
     * 全局开启可以通过 {@link BaseFeignClientConfiguration#getDefaultFeignRequestContextOptions}
     */
    filterNoneValue?: boolean;

    /**
     * 数据混淆配置
     */
    dataObfuscationOptions?: DataObfuscationOptions;

    /**
     * 数据验证调用时的配置
     */
    validateInvokeOptions?: ValidateInvokeOptions | false

    /**
     * 响应数据抓取
     */
    responseExtractor?: ResponseExtractor,
}


export interface FeignRequestContextOptions extends UIOptions, DataOptions {


}


export interface FeignRequestOptions extends FeignRequestBaseOptions, FeignRequestContextOptions {

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





