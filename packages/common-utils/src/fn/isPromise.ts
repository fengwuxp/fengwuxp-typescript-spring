/**
 * 是否为promise对象
 * @author wxup
 * @create 2018-09-06 14:58
 **/

export const isPromise = (obj: any) => {
    if (obj == null) {
        return false;
    }
    return typeof obj.then === "function";
};
