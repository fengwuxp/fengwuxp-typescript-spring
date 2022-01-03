import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import memoize from "lodash/memoize";


/**
 * 将一个函数转为接口代理实例
 * @param handle
 */
const createInterfaceProxy = <T, I/*interface type*/>(handle: Function): I => {
    return newProxyInstanceEnhance<I>({} as I, null, (object, propertyKey, receiver) => {
        return handle;
    });
}

/**
 *docs: https://www.lodashjs.com/docs/lodash.memoize
 */
const cachedProxyFactory = memoize(createInterfaceProxy);

/**
 * converter a single function interface
 * @param handle
 * @return I  对应的接口实例
 */
export const converterFunctionInterface = <T, I/*interface type*/>(handle: T | I): I => {
    if (typeof handle == "function") {
        return cachedProxyFactory<T, I>(handle);
    } else {
        return handle as I;
    }
};
