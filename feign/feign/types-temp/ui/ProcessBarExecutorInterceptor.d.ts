import { FeignRequestOptions, ProgressBarOptions } from "../FeignRequestOptions";
import { HttpResponse } from "../client/HttpResponse";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
import { RequestProgressBar } from "./RequestProgressBar";
/**
 * process bar executor
 */
export default class ProcessBarExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    /**
     * 进度条计数器，用于在同时发起多个请求时，
     * 统一控制加载进度条
     */
    private static count;
    /**
     * 进度条
     */
    protected progressBar: RequestProgressBar;
    /**
     * 当前执行的定时器
     */
    protected timerId: any;
    /**
     * 进度条的相关配置
     */
    protected progressBarOptions: ProgressBarOptions;
    /**
     * 防止抖动，在接口很快响应的时候，不显示进度条
     */
    protected preventJitter: boolean;
    constructor(progressBar: RequestProgressBar, progressBarOptions?: ProgressBarOptions);
    postHandle: <E = HttpResponse<any>>(options: T, response: E) => E;
    preHandle: (options: T) => Promise<T>;
}
