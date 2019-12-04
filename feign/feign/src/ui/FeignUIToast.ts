import {HttpResponse} from "../client/HttpResponse";

/**
 * handle network failure toast
 */
export type NotNetworkToast = () => void;

/**
 * unified failure toast
 * @param response
 */
export type UnifiedFailureToast = (response: HttpResponse) => void | Promise<void>;
