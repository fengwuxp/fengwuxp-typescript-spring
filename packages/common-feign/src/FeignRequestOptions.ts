import {QueryParamType, UriVariable} from "./template/RestOperations";
import {HttpResponse} from "./client/HttpResponse";
import {HttpRequest} from "./client/HttpRequest";
import {DataObfuscationOptions} from "./annotations/security/DataObfuscation";
import {HttpRetryOptions} from "./client/HttpRetryOptions";
import {ResponseExtractor} from "./template/ResponseExtractor";


export interface FeignRequestBaseOptions {


    /**
     * external query parameters
     */
    queryParams?: QueryParamType;

    /**
     * external request headers
     * support '{xxx}' expression，Data can be obtained from request body or query data
     *
     */
    headers?: Record<string, string>;

    /**
     * external request body
     */
    body?: QueryParamType;

    /**
     * 请求超时
     */
    timeout?: number;

    /**
     * 是否开启gzip压缩
     * 默认：false
     */
    enabledGzip?: boolean;

    /**
     * 请求之前的执行的函数，在拦截器执行之前执行
     * @param request
     */
    transformRequest?<T extends HttpRequest>(request: HttpRequest): T;

    /**
     * 响应之后执行的函数 在拦截器执行之后执行
     * @param response
     */
    transformResponse?: (response: HttpResponse) => HttpResponse;
}

export interface FeignRequestOptions extends FeignRequestBaseOptions, UIOptions {
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
     * 使用统一响应转换
     * 默认：true
     */
    useUnifiedTransformResponse?: boolean;

    /**
     * 是否过滤提交数据中的 空字符串，null的数据，数值类型的NaN
     * 默认：true
     */
    filterEmptyString?: boolean;

    /**
     * 进度条配置
     * 进度条控制可以在拦截器实现
     *
     * @see {@link  /src/interceptor/default/NeedProgressBarInterceptor.ts}
     */
    progressBarOptions?: ProgressBarOptions;

    /**
     * 数据混淆配置
     */
    dataObfuscationOptions?: DataObfuscationOptions;

    /**
     * 响应数据抓取
     */
    responseExtractor?: ResponseExtractor,
}

export interface FeignRetryRequestOptions {
    /**
     * 请求重试配置
     */
    retryOptions?: HttpRetryOptions;

}


/**
 * 请求进度条配置
 */
export interface ProgressBarOptions {


    /**
     * 是否使用蒙版
     */
    mask?: boolean;

    /**
     * 提示的延迟时间，
     * 单位毫秒，默认：300
     */
    delay?: number;

    /**
     * 进度条提示标题
     */
    title?: string;

    /**
     * 进度条提示图标
     * 图标，字体图标名称或图片url
     */
    icon?: string;
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
     * @see {@link  /src/interceptor/default/NeedProgressBarInterceptor.ts}
     */
    progressBarOptions?: ProgressBarOptions;
}
