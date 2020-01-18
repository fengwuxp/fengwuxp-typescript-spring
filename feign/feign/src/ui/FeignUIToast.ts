import {HttpResponse} from "../client/HttpResponse";
import {invokeFunctionInterface} from "..";

// /**
//  * handle network failure toast
//  */
// export type NotNetworkToast = () => void;

/**
 * unified failure toast
 * @param response
 */
export type UnifiedFailureToast = (response: HttpResponse | string) => void | Promise<void>;


export type FeignUIToastFunction = (message: string) => Promise<void> | void;

export interface FeignUIToastInterface {

    toast: FeignUIToastFunction;
}

export type FeignUIToast = FeignUIToastFunction | FeignUIToastInterface

export default class FeignUIToastHolder {

    public static feignUIToast: FeignUIToast = console.log;

    public static getFeignUIToast = () => {
        return invokeFunctionInterface<FeignUIToastFunction, FeignUIToastInterface>(FeignUIToastHolder.feignUIToast);
    };

    public static setFeignUIToast = (feignUIToast: FeignUIToast) => {
        return FeignUIToastHolder.feignUIToast;
    }
}
