import {LocationDescriptorObject} from "history";
import {RouteUriVariable} from "./AppCommandRouter";


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
     * 到某个页面
     * @param navigatorDescriptorObject
     */
    push: (navigatorDescriptorObject: T) => void | Promise<any | void>;


    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args) => void | Promise<any | void>;

    /**
     * 路由替换
     * @param navigatorDescriptorObject
     */
    replace?: (navigatorDescriptorObject: T) => void | Promise<any | void>;

    /**
     * 跳转到某个页面，并清空历史跳转记录
     * @param navigatorDescriptorObject
     */
    reLaunch?: (navigatorDescriptorObject: T) => void | Promise<any | void>;

    /**
     * /导航到堆栈的顶部路径，解除所有其他路径
     * @param navigatorDescriptorObject
     */
    popToTop?: (navigatorDescriptorObject: T) => void | Promise<any | void>;


}
