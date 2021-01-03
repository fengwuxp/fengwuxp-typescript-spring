import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from "../client/HttpResponse";
import {UnifiedFailureToast} from "./FeignUIToast";
import {HttpStatus} from "../constant/http/HttpStatus";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";

/**
 * unified transform failure toast
 */
export default class UnifiedFailureToastExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    /**
     * @deprecated
     * {@see AuthenticationBroadcaster}
     */
    private static IS_TO_AUTHENTICATION_VIEW: boolean = false;

    protected unifiedFailureToast: UnifiedFailureToast;


    /**
     * jump authentication view
     * @deprecated
     * {@see AuthenticationBroadcaster}
     */
    protected toAuthenticationViewHandle: Function;

    constructor(unifiedFailureToast?: UnifiedFailureToast, toAuthenticationViewHandle: Function = function () {
    }) {
        this.unifiedFailureToast = unifiedFailureToast;
        this.toAuthenticationViewHandle = toAuthenticationViewHandle;
    }


    postError = (options: T, response: HttpResponse<any>) => {
        if (options.useUnifiedTransformResponse === false) {
            return response;
        }
        this.tryHandleUnAuthorized(response);

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

    /**
     * try send unauthorized event
     * @param response
     */
    protected tryHandleUnAuthorized = async (response: HttpResponse<any>) => {


        if (response.statusCode !== HttpStatus.UNAUTHORIZED) {
            return;
        }

        const feignConfiguration = await FeignConfigurationRegistry.getDefaultFeignConfiguration();
        const getAuthenticationBroadcaster = feignConfiguration.getAuthenticationBroadcaster;
        if (getAuthenticationBroadcaster != null) {
            const authenticationBroadcaster = getAuthenticationBroadcaster();
            const authenticationStrategy = feignConfiguration.getAuthenticationStrategy();
            if (authenticationStrategy.clearCache != null) {
                authenticationStrategy.clearCache()
            }
            authenticationBroadcaster.sendUnAuthorizedEvent();
            return;
        }

        if (!UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW) {
            UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW = true;
            this.toAuthenticationViewHandle();
            setTimeout(() => {
                UnifiedFailureToastExecutorInterceptor.IS_TO_AUTHENTICATION_VIEW = false
            }, 20 * 1000);
        }
    }

}
