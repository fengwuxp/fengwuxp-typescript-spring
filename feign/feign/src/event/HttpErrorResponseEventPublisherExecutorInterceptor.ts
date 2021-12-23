import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {getRequestFeignConfiguration} from "../context/RequestContextHolder";
import {HttpResponseEventHandler} from "./HttpResponseEvent";
import {FeignHttpConfiguration} from "../configuration/FeignHttpConfiguration";


export default class HttpErrorResponseEventPublisherExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {

    private readonly errorResponseHandler: HttpResponseEventHandler;

    /**
     * 对应的配置是否注册了统一错误回调
     * @key 配置
     * @value 是否已经注册了错误回调
     * @private
     */
    private readonly registeredCaches: Map<FeignHttpConfiguration, boolean> = new Map<FeignHttpConfiguration, boolean>();

    constructor(errorHandle?: HttpResponseEventHandler) {
        this.errorResponseHandler = (request: FeignRequestOptions, response: HttpResponse) => {
            if (request.useUnifiedToast === false) {
                return
            }
            if (errorHandle != null) {
                errorHandle(request, response);
            }
        }
    }

    postError = (options: T, response: HttpResponse) => {
        this.registerErrorListener(options);
        this.publishEvent(options, response);
        return Promise.reject(response);
    };

    private registerErrorListener = (options: T) => {
        const feignConfiguration = getRequestFeignConfiguration(options);
        if (feignConfiguration == null) {
            return;
        }

        if (this.registeredCaches.get(feignConfiguration) === true) {
            return;
        }
        this.registeredCaches.set(feignConfiguration, true);
        feignConfiguration.getHttpResponseEventListener().onError(this.errorResponseHandler);
    }

    /**
     * @param options
     * @param response
     */
    private publishEvent = (options: T, response: HttpResponse) => {
        const feignConfiguration = getRequestFeignConfiguration(options);
        if (feignConfiguration != null) {
            feignConfiguration.getHttpResponseEventPublisher().publishEvent(options, response);
        }
    }
}
