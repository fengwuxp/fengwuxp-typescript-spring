import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "./FeignUIToast";

/**
 * unified transform failure toast
 */
export default class UnifiedFailureToastExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    protected unifiedFailureToast: UnifiedFailureToast;


    constructor(unifiedFailureToast?: UnifiedFailureToast) {
        this.unifiedFailureToast = unifiedFailureToast;
    }


    postError = (options: T, response: HttpResponse<any>) => {
        if (options.useUnifiedTransformResponse === false) {
            return response;
        }

        this.tryToast(options, response);
        return Promise.reject(response);
    };


    protected tryToast = (options: T, response: HttpResponse) => {
        if (this.unifiedFailureToast == null) {
            return;
        }
        if (options.useUnifiedToast === false) {
            return;
        }
        // use failure toast
        this.unifiedFailureToast(response);
    }


}
