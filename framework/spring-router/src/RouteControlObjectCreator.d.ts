import { NavigatorAdapter } from "./NavigatorAdapter";
/**
 * 路由跳转方法
 */
export declare type JumpMethod<P = {
    [key: string]: any;
}, S = {
    [key: string]: any;
}> = (queryParams: P, state: S) => Promise<void>;
/**
 * 路由控制对象
 */
export interface RouteControlObject extends NavigatorAdapter {
}
/**
 * 路由控制对象创建者
 *
 * @param routeAdapter 导航适配器
 */
export declare const createControlObject: <T extends RouteControlObject>(routeAdapter: NavigatorAdapter) => T;
