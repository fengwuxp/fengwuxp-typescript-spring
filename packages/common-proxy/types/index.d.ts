/**
 * 拦截方法
 * @param object       被拦截的对象
 * @param propertyKey  被拦截的属性
 * @param receiver
 * @return  可以返回值，也可以返回一个函数
 */
declare type MethodInterceptor = (object: any, propertyKey: PropertyKey, receiver: any) => MethodProxy | any;
declare type MethodProxy = (...args: any[]) => any;
/**
 * 属性拦截
 * @param object       被拦截的对象
 * @param propertyKey  被拦截的属性
 * @param value        设置属性的值
 * @param receiver
 * @return  是否设置成功
 */
declare type SetPropertyInterceptor = (object: any, propertyKey: PropertyKey, value: any, receiver: any) => boolean;

/**
 * 代理的生效的范围
 */
declare const enum ProxyScope {
    ALL = 0,
    /**
     * 仅处理方法的代理
     */
    METHOD = 1,
    /**
     * 处理属性的 get和set
     */
    PROPERTY = 2,
    /**
     * 仅处理属性的get
     */
    /**
     * 仅处理属性set
     */
    ONLY_SET = 3
}

declare type CustomMatchType<T = any> = (object: any, propertyKey: string) => boolean | RegExp;
interface ProxyCreateConfig<T = any> {
    /**
     * 代理的目标
     */
    object: any;
    /**
     * 方法拦截
     */
    methodInterceptor: MethodInterceptor;
    /**
     * 没有找到方法或者属性时的增强处理
     */
    noSuchMethodInterceptor?: MethodInterceptor;
    /**
     * 设置属性拦截,在需要代理set method方法传入
     */
    setPropertyInterceptor?: SetPropertyInterceptor;
    /**
     * 默认 ProxyScope.METHOD
     */
    scope?: ProxyScope;
    /**
     * 自定义的匹配
     * @param prop
     */
    customMatch?: CustomMatchType<T>;
}

interface ProxyFactory {
    factory: <T extends any = object>(config: ProxyCreateConfig<T>) => T;
}

declare class DefaultFactory implements ProxyFactory {
    factory: <T extends object = any>(config: ProxyCreateConfig<T>) => any;
}

declare const proxyFactory: DefaultFactory;
/**
 * 实例化一个代理对象
 * @param target
 * @param methodInterceptor
 * @param setPropertyInterceptor
 * @param scope
 * @param customMatch
 */
declare const newProxyInstance: <T>(target: T, methodInterceptor: MethodInterceptor, setPropertyInterceptor?: SetPropertyInterceptor, scope?: ProxyScope, customMatch?: CustomMatchType<any>) => T;
/**
 *  实例化一个代理对象并对其进行增强
 * @param target
 * @param methodInterceptor
 * @param noSuchMethodInterceptor
 */
declare const newProxyInstanceEnhance: <T>(target: T, methodInterceptor: MethodInterceptor, noSuchMethodInterceptor: MethodInterceptor) => T;

export { ProxyScope, newProxyInstance, newProxyInstanceEnhance, proxyFactory };
