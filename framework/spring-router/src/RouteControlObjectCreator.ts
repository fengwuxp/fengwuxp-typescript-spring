import ProxyFactory from "fengwuxp_common_proxy/src/ProxyFactory";
import {NavigatorAdapter} from "./NavigatorAdapter";
import DefaultRouteMethodResolver from "./resolve/DefaultRouteMethodResolver";
import {RouteMethodResolver} from "./resolve/RouteMethodResolver";


/**
 * 路由跳转方法
 */
export type JumpMethod<P = {
    [key: string]: any
}, S = {
    [key: string]: any
}> = (queryParams: P, state: S) => Promise<void>;

/**
 * 路由控制对象
 */
export interface RouteControlObject extends NavigatorAdapter {

    // [key: string]: JumpMethod;
}

const routeMethodResolver: RouteMethodResolver = new DefaultRouteMethodResolver();

/**
 * 路由控制对象创建者
 *
 * @param routeAdapter 导航适配器
 */
export const createControlObject = <T extends RouteControlObject>(routeAdapter: NavigatorAdapter): T => {


    return ProxyFactory.newProxyInstanceEnhance<T>(
        routeAdapter as any,
        (object: any, propertyKey: PropertyKey, receiver: any) => {
            return routeAdapter[propertyKey];
        },
        (object: any, methodName: string, receiver: any) => {
            const pageUrl = routeMethodResolver.methodNameToUri(methodName);
            return (queryParams, state) => {
                return routeAdapter.push({
                    pathname: pageUrl,
                    queryParams,
                    state
                });
            }
        });
};