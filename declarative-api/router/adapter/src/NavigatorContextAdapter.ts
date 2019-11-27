import {NavigatorDescriptorObject} from "./NavigatorAdapter";
import {RouteUriVariable} from "./AppCommandRouter";
import {RouterCommand} from "./RouterCommand";

/**
 * 导航的上下文信息适配
 */
export interface NavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {

    /**
     * get current NavigatorDescriptorObject
     *
     * @return T
     */
    getCurrentObject: () => T;

    /**
     * get current view pathname
     */
    getCurrentPathname: () => string;

    /**
     * get current state
     */
    getCurrentState: <S = RouteUriVariable>() => S;

    /**
     * get current uriVariable
     */
    getCurrentUriVariables: <S = RouteUriVariable>() => S;

    /**
     * 获取 栈中的history
     */
    getBrowseHistory: () => Array<T>;

    /**
     * 是否为栈顶
     */
    isStackTop: () => boolean;

    /**
     * 是否为预期的页面
     */
    isView: (pathname: string) => boolean;

    /**
     *  操作 历史记录
     * @param routerCommand
     * @param navigatorDescriptorObject
     */
    operateBrowseHistory: (routerCommand: RouterCommand, navigatorDescriptorObject?: T) => void;
}

