import { HttpResponse } from "../client/HttpResponse";
/**
 * handle network failure toast
 */
export declare type NotNetworkToast = () => void;
/**
 * unified failure toast
 * @param response
 */
export declare type UnifiedFailureToast = (response: HttpResponse) => void | Promise<void>;
