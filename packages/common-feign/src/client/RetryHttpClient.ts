import {HttpClient} from "./HttpClient";
import {HttpRequest} from "./HttpRequest";
import { HttpRetryOptions} from "./RetryHttpRequest";
import {HttpResponse} from "./HttpResponse";
import DefaultHttpClient from "./DefaultHttpClient";


/**
 * support retry http client
 * HttpClient with retry, need to be recreated each time you use this client
 */
export default class RetryHttpClient<T extends HttpRequest> extends DefaultHttpClient<T> implements HttpClient<T> {

    private httpClient: HttpClient<T>;

    //重试的配置
    protected retryOptions: HttpRetryOptions;

    //统计重试的请求次数
    private countRetry: number = 0;

    constructor(httpClient: HttpClient<T>, retryOptions: HttpRetryOptions) {
        super(httpClient);
        this.httpClient = httpClient;
        this.retryOptions = retryOptions;
        if (this.retryOptions.onRetry == null) {
            this.retryOptions.onRetry = this.onRetry;
        }
        if (this.retryOptions.when == null) {
            this.retryOptions.when = this.whenRetry;
        }
    }


    send = (req: T): Promise<HttpResponse> => {
        const retryOptions = this.retryOptions;

        console.debug("retry client request", req, retryOptions);

        const _maxTimeout = retryOptions.maxTimeout;


        return new Promise<HttpResponse>((resolve, reject) => {

            const retries = retryOptions.retries;
            const p: Promise<HttpResponse> = this.send(req).catch((response) => {
                //try retry
                console.debug("--失败准备重试->", response);
                return this.tryRetry(req, retryOptions, response);
            });

            //timeout control
            const timerId = setTimeout(() => {
                reject(new Error(`retry timeout，retry number${this.countRetry}次`));
            }, _maxTimeout + retries * 10);

            p.then(resolve)
                .catch(reject)
                .finally((data) => {
                    console.log("clear timeout", timerId);
                    clearTimeout(timerId);
                    return data;
                });
        });
    };


    /**
     * 尝试去重试
     * @param request
     * @param options
     * @param response
     */
    private tryRetry = (request: T, options: HttpRetryOptions, response): Promise<HttpResponse> => {

        const _onRetry = options.onRetry || this.retryOptions.onRetry;

        // 以随机一个随机数
        const _delay = Math.ceil(Math.random() * (options.delay || this.retryOptions.delay)) + 32;

        const retries = options.retries || this.retryOptions.retries;

        const when = options.when || this.retryOptions.when;


        return new Promise<HttpResponse>((resolve, reject) => {
            const errorHandle = (resp) => {
                if (this.countRetry === retries) {
                    console.debug("请求达到最大重试次数", retries);
                    reject(`retry end，count ${retries}`);
                    return
                }
                console.debug(`在${_delay}毫秒后准备开始第${this.countRetry + 1}次重试`, resp);

                setTimeout(() => {
                    this.countRetry++;
                    _onRetry(request, resp).then(resolve).catch((error) => {
                        if (when(error)) {
                            errorHandle(error);
                        } else {
                            console.debug("放弃重试");
                            reject(error);
                        }
                    });
                }, _delay);
            };

            errorHandle(response);
        });
    };


    /**
     * default retry handle
     * @param rqq
     * @param response
     */
    private onRetry = <FetchResponse>(rqq: T, response): Promise<FetchResponse> => {
        return this.send(rqq) as any;
    };


    /**
     * whether to retry
     * @param response
     */
    private whenRetry = (response: HttpResponse) => {
        console.log("when retry", response);
        if (response.status == null) {

            return true;
        }
        //响应码大于400没有重试的必要了
        return response.status && response.status < 400;
    };

}
