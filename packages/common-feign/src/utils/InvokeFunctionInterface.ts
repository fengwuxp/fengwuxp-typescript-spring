/**
 * invoke a single function interface
 * @param handle
 */
export const invokeFunctionInterface = <T,F>(handle: T):F => {
    if (typeof handle == "function") {
        return handle as any;
    } else {
        const name = Object.keys(handle)[0];
        return handle[name] as F;
    }
};
