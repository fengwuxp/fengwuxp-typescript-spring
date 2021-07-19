import {FeignRequestOptions} from "../FeignRequestOptions";
import {HttpResponse} from "../client/HttpResponse";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {
    CloseRequestProgressBarFunction,
    ProgressBarOptions,
    RequestProgressBar,
    RequestProgressBarInterface
} from "./RequestProgressBar";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";

/**
 * process bar executor
 */
export default class ProcessBarExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    /**
     * 进度条的相关配置
     */
    private readonly progressBarOptions: ProgressBarOptions;

    /**
     * 防止抖动，在接口很快响应的时候，不显示进度条
     */
    private readonly preventJitter: boolean = true;

    /**
     * 进度条
     */
    private readonly progressBar: RequestProgressBar;

    /**
     * 进度条计数器，用于在同时发起多个请求时，
     * 统一控制加载进度条
     */
    private count: number = 0;

    /**
     * 当前执行的定时器
     */
    private timerId;

    /**
     * 关闭 request progress bar fn
     */
    private closeRequestProgressBarFunction: CloseRequestProgressBarFunction;

    constructor(progressBar: RequestProgressBar, progressBarOptions?: ProgressBarOptions) {
        this.progressBar = progressBar;
        this.progressBarOptions = progressBarOptions || {
            //默认延迟300毫秒
            delay: 300,
            mask: false
        };
        //延迟显示的时间最少要大于等于100毫秒才会启用防止抖动的模式
        this.preventJitter = this.progressBarOptions.delay >= 100;
        this.closeRequestProgressBarFunction = () => {
        };
    }

    postHandle = <E = HttpResponse>(options: T, response: E) => {
        if (this.needShowProcessBar(options)) {
            // 计数器减一
            this.count--;
            if (this.count === 0) {
                //清除定时器
                clearTimeout(this.timerId);
                this.closeRequestProgressBar();
            }
        }
        return response;
    };


    preHandle = async (options: T) => {
        if (this.needShowProcessBar(options)) {
            if (this.count === 0) {
                this.showProgressBar(options);
            }
            // 计数器加一
            this.count++;
        }
        return options;
    };

    postError = async (options: T, response: HttpResponse) => {
        return this.postHandle(options, response);
    };

    private needShowProcessBar = (options: T) => {
        return options.useProgressBar !== false;
    }

    private showProgressBar(options: T) {
        // 显示加载进度条
        if (this.preventJitter) {
            const progressBarOptions = this.getRequestProgressBarOptions(options);
            this.timerId = setTimeout(() => {
                this.showRequestProgressBar(this.getRequestProgressBarOptions(options));
            }, progressBarOptions.delay);
        } else {
            this.showRequestProgressBar(this.getRequestProgressBarOptions(options));
        }
    }

    private getRequestProgressBarOptions = (options: T) => {
        const {progressBarOptions} = this;
        return {
            ...progressBarOptions,
            ...(options.progressBarOptions || {})
        };
    }

    private showRequestProgressBar = (progressBarOptions: ProgressBarOptions) => {
        const {progressBar} = this;
        this.closeRequestProgressBarFunction = invokeFunctionInterface<RequestProgressBar, RequestProgressBarInterface>(progressBar).showProgressBar(progressBarOptions);
    }

    private closeRequestProgressBar = () => {
        const {closeRequestProgressBarFunction} = this;
        // 隐藏加载进度条
        closeRequestProgressBarFunction();
    }
}