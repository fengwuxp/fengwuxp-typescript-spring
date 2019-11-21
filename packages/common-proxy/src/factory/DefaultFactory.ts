import {ProxyFactory} from "./ProxyFactory";
import {ProxyCreateConfig} from "../ProxyCreateConfig";
import {matchProxyScope, ProxyScope} from "../ProxyScope";
import {Es5Proxy} from "../Es5Proxy";


export class DefaultFactory implements ProxyFactory {

    factory = <T extends object = any>(config: ProxyCreateConfig<T>) => {

        const {
            object,
            scope,
            methodInterceptor,
            setPropertyInterceptor,
            customMatch,
            noSuchMethodInterceptor
        } = config;

        const proxyHandler: ProxyHandler<T> = {
            get: (target: T, propertyKey: PropertyKey, receiver: any): any => {


                let element = target[propertyKey];
                const isMethod = typeof element === "function";
                const isNullOrUndefined = element == null;

                if (isNullOrUndefined) {
                    //noSuchMethod
                    if (noSuchMethodInterceptor != null) {
                        element = noSuchMethodInterceptor(target, propertyKey, receiver);
                        //保证this 对象的传递
                        return element.bind(target);
                    } else {
                        //not exist
                        throw new Error(`prop: ${propertyKey.toString()} not exist`);
                    }
                } else {
                    if (match(target, propertyKey, isMethod, scope, customMatch)) {
                        //匹配
                        if (methodInterceptor != null) {
                            element = methodInterceptor(target, propertyKey, receiver);
                        }
                    } else {
                        //not match
                        throw new Error(`prop: ${propertyKey.toString()} not match`)
                    }
                }
                if (isMethod) {
                    //保证this 对象的传递
                    return element.bind(target);
                }
                return element;
            },
            set: (target: T, propertyKey: PropertyKey, value: any, receiver: any): boolean => {
                if (match(target, propertyKey, false, scope, customMatch)) {
                    return setPropertyInterceptor(target, propertyKey, value, null);
                } else {
                    //保持原有的行为
                    target[propertyKey] = value;
                    return true;
                }
            }
        };

        if (typeof Proxy === "undefined") {
            return Es5Proxy(object, proxyHandler);
        }

        return new Proxy(object, proxyHandler);
    };


}

/**
 * 是否匹配代理执行的要求
 * @param target
 * @param propertyKey
 * @param isMethod
 * @param scope
 * @param customMatch
 */
const match = (target: any,
               propertyKey: PropertyKey,
               isMethod: boolean,
               scope: ProxyScope,
               customMatch) => {
    if (customMatch != null) {
        if (typeof customMatch === "function") {
            return customMatch(target, propertyKey);
        } else if (customMatch.constructor === RegExp) {
            return (customMatch as RegExp).test(propertyKey as string);
        } else {
            return propertyKey === customMatch;
        }
    }
    const value = target[propertyKey];
    return matchProxyScope(value, isMethod, scope);
};
