type Es5ProxyType<T extends object = any> = (target: T, handler: ProxyHandler<T>) => T;


/**
 * 模拟es6Proxy的实现
 * @param target
 * @param handler
 * @constructor
 */
export const Es5Proxy: Es5ProxyType = <T extends object = any>(target: T, handler: ProxyHandler<T>): T => {
    //      value:属性的值
    //      writable:如果为false，属性的值就不能被重写,只能为只读了
    //      configurable:总开关，一旦为false，就不能再设置他的（value，writable，configurable）
    //      enumerable:是否能在for...in循环中遍历出来或在Object.keys中列举出来。
    const proxy: T = {} as T;
    for (const propKey in target) {

        Object.defineProperty(proxy, propKey, {
            set(val) {
                const setMethod = handler.set;
                if (setMethod) {
                    return setMethod(target, propKey, val, null);
                }
                throw new Error("nut support set method interceptor");
            },
            get() {
                const getMethod = handler.get;
                if (getMethod) {
                    return getMethod(target, propKey, null);
                }
                throw new Error("nut support method interceptor");
            }
        });
    }

    return proxy;
};

