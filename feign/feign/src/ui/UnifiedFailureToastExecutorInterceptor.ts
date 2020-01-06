import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "./FeignUIToast";
import {HttpStatus} from "../constant/http/HttpStatus";

/**
 * unified transform failure toast
 */
export default class UnifiedFailureToastExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    private static IS_TO_AUTHENTICATION_VIEW: boolean = false;

    protected unifiedFailureToast: UnifiedFailureToast;

    // jump authentication view
    protected toAuthenticationViewHandle: Function;

    constructor(unifiedFailureToast?: UnifiedFailureToast, toAuthenticationViewHandle?: Function) {
        this.unifiedFailureToast = unifiedFailureToast;
        this.toAuthenticationViewHandle = toAuthenticationViewHandle || function () {
        };
    }


    postError = (options: T, response: HttpResponse<any>) => {
        if (options.useUnifiedTransformResponse === false) {
            return response;
        }
        if (response.statusCode === HttpStatus.UNAUTHORIZED) {
            UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW = true;
            if (!UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW) {
                this.toAuthenticationViewHandle();
                setTimeout(() => {
                    UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW = false
                }, 20 * 1000);
            }
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
