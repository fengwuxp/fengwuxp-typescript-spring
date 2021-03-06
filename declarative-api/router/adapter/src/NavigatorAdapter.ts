import {LocationDescriptorObject} from "history";
import {RouteUriVariable} from "./AppCommandRouter";


export type NavigatorJumpRouteFunction = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T | string,
                                                                                                           uriVariables?: RouteUriVariable,
                                                                                                           state?: RouteUriVariable) => Promise<any> | void ;

export interface NavigatorDescriptorObject extends LocationDescriptorObject {

    /**
     * uriVariables
     */
    uriVariables?: RouteUriVariable;
}

/**
 * 导航器适配器
 */
export interface NavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {


    /**
     * 以对话框的形式打开一个页面
     */
    pushDialog?: NavigatorJumpRouteFunction;

    /**
     * 跳转到下个页面
     * @param navigatorDescriptorObject
     */
    push: NavigatorJumpRouteFunction;

    /**
     * 跳转到下个页面 {@link NavigatorAdapter#push}
     * @param navigatorDescriptorObject
     */
    toView: NavigatorJumpRouteFunction;

    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args) => void | Promise<any | void>;

    /**
     * 路由替换
     * @param navigatorDescriptorObject
     */
    replace?: NavigatorJumpRouteFunction;

    /**
     * 跳转到某个页面，并清空历史跳转记录
     * @param navigatorDescriptorObject
     */
    reLaunch?: NavigatorJumpRouteFunction;

    /**
     * 导航到堆栈的顶部路径，解除所有其他路径
     * @param navigatorDescriptorObject
     */
    popToTop?: NavigatorJumpRouteFunction;

    /**
     * 移除当前页面，并跳转新页面
     */
    popAndPush?: NavigatorJumpRouteFunction;

    /**
     * 跳转到tab页面的的某个页面
     */
    switchTab?: NavigatorJumpRouteFunction;


}
