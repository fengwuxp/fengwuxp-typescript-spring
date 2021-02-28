import { RouteMethodResolver } from "./RouteMethodResolver";
/**
 * 默认的路由方法解析者
 */
export default class DefaultRouteMethodResolver implements RouteMethodResolver {
    methodNameToUri: (methodName: string) => string;
    uriToMethodName: (uri: string) => string;
}
