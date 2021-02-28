import ProxyFactory from "fengwuxp_common_proxy/src/ProxyFactory";
import DefaultRouteMethodResolver from "./resolve/DefaultRouteMethodResolver";
const routeMethodResolver = new DefaultRouteMethodResolver();
/**
 * 路由控制对象创建者
 *
 * @param routeAdapter 导航适配器
 */
export const createControlObject = (routeAdapter) => {
    return ProxyFactory.newProxyInstanceEnhance(routeAdapter, (object, propertyKey, receiver) => {
        return routeAdapter[propertyKey];
    }, (object, methodName, receiver) => {
        const pageUrl = routeMethodResolver.methodNameToUri(methodName);
        return (queryParams, state) => {
            return routeAdapter.push({
                pathname: pageUrl,
                queryParams,
                state
            });
        };
    });
};
