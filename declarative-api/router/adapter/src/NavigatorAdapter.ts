import {LocationDescriptorObject} from "history";
import {RouteUriVariable} from "./AppCommandRouter";

export type NavigatorJumpRouteFunction = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T) => Promise<any> | void ;

export interface NavigatorDescriptorObject extends LocationDescriptorObject {

    /**
     * uriVariables
     */
    uriVariables?: RouteUriVariable
}

/**
 * 导航器适配器
 */
export interface NavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {


    /**
     * 跳转到下个页面
     * @param navigatorDescriptorObject
     */
    push: NavigatorJumpRouteFunction;


    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args) => void | Promise<any | void>;

    /**
     * 路由替换
     * @param navigatorDescriptorObject
     */
    replace?: NavigatorJumpRouteFunction

    /**
     * 跳转到某个页面，并清空历史跳转记录
     * @param navigatorDescriptorObject
     */
    reLaunch?: NavigatorJumpRouteFunction

    /**
     * /导航到堆栈的顶部路径，解除所有其他路径
     * @param navigatorDescriptorObject
     */
    popToTop?: NavigatorJumpRouteFunction


}
