import {MethodInterceptor, SetPropertyInterceptor} from "./ProxyInterceptor";
import {ProxyScope} from "./ProxyScope";
import {DefaultFactory} from "./factory/DefaultFactory";
import {CustomMatchType} from "./ProxyCreateConfig";

export {ProxyScope} from "./ProxyScope";
export const proxyFactory = new DefaultFactory();

/**
 * 实例化一个代理对象
 * @param target
 * @param methodInterceptor
 * @param setPropertyInterceptor
 * @param scope
 * @param customMatch
 */
export const newProxyInstance = <T>(target: T,
                                    methodInterceptor: MethodInterceptor,
                                    setPropertyInterceptor?: SetPropertyInterceptor,
                                    scope?: ProxyScope,
                                    customMatch?: CustomMatchType): T => {

    return proxyFactory.factory({
        object: target,
        methodInterceptor,
        setPropertyInterceptor,
        scope: scope,
        customMatch
    });
};


/**
 *  实例化一个代理对象并对其进行增强
 * @param target
 * @param methodInterceptor
 * @param noSuchMethodInterceptor
 */
export const newProxyInstanceEnhance = <T>(target: T,
                                           methodInterceptor: MethodInterceptor,
                                           noSuchMethodInterceptor: MethodInterceptor): T => {

    return proxyFactory.factory({
        object: target,
        methodInterceptor,
        noSuchMethodInterceptor
    });
};
