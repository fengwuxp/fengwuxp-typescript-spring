import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "../ui/FeignUIToast";
import {getRequestFeignConfiguration} from "../context/RequestContextHolder";
import {HttpResponseEventHandler} from "./HttpResponseEvent";


export default class HttpErrorResponseEventPublisherExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {

    private registered: boolean = false;

    private readonly errorResponseHandler: HttpResponseEventHandler

    constructor(unifiedFailureToast?: UnifiedFailureToast) {
        this.errorResponseHandler = (request: FeignRequestOptions, response: HttpResponse) => {
            if (request.useUnifiedTransformResponse === false) {
                return
            }
            if (unifiedFailureToast != null) {
                unifiedFailureToast(response);
            }
        }
    }

    postError = (options: T, response: HttpResponse) => {
        this.registerErrorListener(options);
        this.publishEvent(options, response);
        return Promise.reject(response);
    };

    private registerErrorListener = (options: T) => {
        if (this.registered) {
            return
        }
        this.registered = true;
        const feignConfiguration = getRequestFeignConfiguration(options);
        if (feignConfiguration != null) {
            feignConfiguration.getHttpResponseEventListener().onError(this.errorResponseHandler);
        }
    }

    /**
     * @param options
     * @param response
     */
    private publishEvent = async (options: T, response: HttpResponse) => {
        const feignConfiguration = getRequestFeignConfiguration(options);
        if (feignConfiguration != null) {
            feignConfiguration.getHttpResponseEventPublisher().publishEvent(options, response);
        }
    }
}
