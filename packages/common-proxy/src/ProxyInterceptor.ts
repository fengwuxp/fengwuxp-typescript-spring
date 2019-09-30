/**
 * 拦截方法
 * @param object       被拦截的对象
 * @param propertyKey  被拦截的属性
 * @param receiver
 * @return  可以返回值，也可以返回一个函数
 */
export type MethodInterceptor = (object: any, propertyKey: PropertyKey, receiver: any) => MethodProxy | any;

type MethodProxy = (...args) => any;


/**
 * 属性拦截
 * @param object       被拦截的对象
 * @param propertyKey  被拦截的属性
 * @param value        设置属性的值
 * @param receiver
 * @return  是否设置成功
 */
export type SetPropertyInterceptor = (object: any, propertyKey: PropertyKey, value: any, receiver: any) => boolean;