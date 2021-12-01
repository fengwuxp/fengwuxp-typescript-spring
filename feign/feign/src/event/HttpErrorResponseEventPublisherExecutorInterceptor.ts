import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "../ui/FeignUIToast";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";


export default class HttpErrorResponseEventPublisherExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {

    constructor(unifiedFailureToast?: UnifiedFailureToast) {
        if (unifiedFailureToast != null) {
            FeignConfigurationRegistry.getDefaultFeignConfiguration().then((configuration) => {
                configuration.getHttpResponseEventListener().onError(unifiedFailureToast)
            })
        }
    }

    postError = (options: T, response: HttpResponse) => {
        if (options.useUnifiedTransformResponse === false) {
            return response;
        }
        this.publishEvent(response);
        return Promise.reject(response);
    };

    /**
     * try send unauthorized event
     * @param response
     */
    private publishEvent = async (response: HttpResponse) => {
        const feignConfiguration = await FeignConfigurationRegistry.getDefaultFeignConfiguration();
        feignConfiguration.getHttpResponseEventPublisher().publishEvent(response);
    }
}
