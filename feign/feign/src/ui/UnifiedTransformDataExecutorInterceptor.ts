import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "./FeignUIToast";

/**
 * unified transform data
 */
export default class UnifiedTransformDataExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    protected unifiedFailureToast: UnifiedFailureToast;


    constructor(unifiedFailureToast?: UnifiedFailureToast) {
        this.unifiedFailureToast = unifiedFailureToast;
    }

    postHandle = <E = HttpResponse>(options: T, response: any) => {

        if (options.useUnifiedTransformResponse === false) {
            return response;
        }

        if (response.ok) {
            return response.data;
        }
        this.tryToast(options, response);

        return Promise.reject(response);
    };

    preHandle = <T>(options: T) => {
        return options;
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
