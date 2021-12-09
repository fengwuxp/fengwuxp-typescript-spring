import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {getRequestFeignConfiguration} from "../context/RequestContextHolder";
import {HttpResponseEventHandler} from "./HttpResponseEvent";
import {FeignConfiguration} from "../configuration/FeignConfiguration";


export default class HttpErrorResponseEventPublisherExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {

    private readonly errorResponseHandler: HttpResponseEventHandler;

    private readonly registeredCaches: Map<FeignConfiguration, boolean> = new Map<FeignConfiguration, boolean>();

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
