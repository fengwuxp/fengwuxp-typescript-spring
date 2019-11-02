import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";

/**
 * invoke a single function interface
 * @param handle
 */
export const invokeFunctionInterface = <T, I/*interface type*/>(handle: T): I => {
    if (typeof handle == "function") {
        //TODO cache proxy object
        return newProxyInstanceEnhance<I>({} as I, null, (object, propertyKey, receiver) => {
            return handle;
        })
    } else {
        return handle as any;
    }
};
