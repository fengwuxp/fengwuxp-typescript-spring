import { FeignRequestOptions } from "../FeignRequestOptions";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
import { HttpResponse } from "../client/HttpResponse";
import { UnifiedFailureToast } from "./FeignUIToast";
/**
 * unified transform data
 */
export default class UnifiedTransformDataExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    protected unifiedFailureToast: UnifiedFailureToast;
    constructor(unifiedFailureToast?: UnifiedFailureToast);
    postHandle: <E = HttpResponse<any>>(options: T, response: any) => any;
    preHandle: <T_1>(options: T_1) => T_1;
    protected tryToast: (options: T, response: HttpResponse<any>) => void;
}
