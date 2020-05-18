import {FeignRequestOptions} from "../FeignRequestOptions";
import {HttpResponse} from "../client/HttpResponse";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {ProgressBarOptions, RequestProgressBar} from "./RequestProgressBar";

/**
 * process bar executor
 */
export default class ProcessBarExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    /**
     * 进度条计数器，用于在同时发起多个请求时，
     * 统一控制加载进度条
     */
    private count: number = 0;

    /**
     * 进度条
     */
    protected progressBar: RequestProgressBar;


    /**
     * 当前执行的定时器
     */
    protected timerId;

    /**
     * 进度条的相关配置
     */
    protected progressBarOptions: ProgressBarOptions;

    /**
     * 防止抖动，在接口很快响应的时候，不显示进度条
     */
    protected preventJitter: boolean = true;

    constructor(progressBar: RequestProgressBar, progressBarOptions?: ProgressBarOptions) {
        this.progressBar = progressBar;
        this.progressBarOptions = progressBarOptions || {
            //默认延迟300毫秒
            delay: 300,
            mask: false
        };
        //延迟显示的时间最少要大于等于100毫秒才会启用防止抖动的模式
        this.preventJitter = this.progressBarOptions.delay >= 100;
    }

    postHandle = <E = HttpResponse<any>>(options: T, response: E) => {

        if (!this.needShowProcessBar(options)) {
            //不使用进度条
            return response;
        }

        const {timerId, progressBar} = this;
        //计数器减一
        this.count--;
        if (this.count === 0) {
            //清除定时器
            clearTimeout(timerId);
            //隐藏加载进度条
            progressBar.hideProgressBar();
        }

        return response;
    };

    preHandle = async (options: T) => {

        if (!this.needShowProcessBar(options)) {
            //不使用进度条
            return options;
        }
        const {progressBar, progressBarOptions} = this;
        if (this.count === 0) {
            const _progressBarOptions = {
                ...progressBarOptions,
                ...(options.progressBarOptions || {})
            };
            //显示加载进度条
            if (this.preventJitter) {
                this.timerId = setTimeout(() => {
                    progressBar.showProgressBar(_progressBarOptions);
                }, _progressBarOptions.delay);
            } else {
                progressBar.showProgressBar(_progressBarOptions);
            }
        }

        //计数器加一
        this.count++;
        return options;
    };

    postError = async (options: T, response: HttpResponse<any>) => {
        return this.postHandle(options, response);
    };

    protected needShowProcessBar = (options: T) => {
        if (options.useProgressBar === false) {
            //不使用进度条
            return false;
        }
        return true;
    }


}


