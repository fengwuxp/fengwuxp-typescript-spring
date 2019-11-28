import { LocationDescriptorObject } from 'history';
import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * 路由指令
 */
declare enum RouterCommand {
    PUSH = "push",
    TO = "to",
    POP = "pop",
    POP_TO_TOP = "popToTop",
    POP_AND_PUSH = "popAndPush",
    RESET = "reLaunch",
    REPLACE = "replace"
}

declare type NavigatorJumpRouteFunction = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<any> | void;
interface NavigatorDescriptorObject extends LocationDescriptorObject {
    /**
     * uriVariables
     */
    uriVariables?: RouteUriVariable;
}
/**
 * 导航器适配器
 */
interface NavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {
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
    goBack: (num?: number, ...args: any[]) => void | Promise<any | void>;
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
}

/**
 * 导航的上下文信息适配
 */
interface NavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {
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
}

/**
 * uri path variable
 */
declare type UriPathVariable = Array<boolean | string | number | Date>;
/**
 * query params type
 */
declare type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;
declare type RouteUriVariable = boolean | number | string | UriPathVariable | QueryParamType;
/**
 * @param uriVariables
 * @param state
 * @param command
 */
declare type RouterCommandMethod<T = RouteUriVariable, S = RouteUriVariable> = (uriVariables?: T, state?: S | RouterCommand, command?: RouterCommand) => Promise<void> | void;
/**
 * app command router
 */
interface AppCommandRouter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> extends NavigatorAdapter<T>, NavigatorContextAdapter<T> {
    getNavigatorAdapter: () => NavigatorAdapter;
    getNavigatorContextAdapter: () => NavigatorContextAdapter;
}

/**
 * Confirm before route jump
 * @param object
 * @return  NavigatorJumpRouteFunction or boolean ,if return  true: jump next route, if return route function NavigatorJumpRouteFunction
 */
declare type RouteConfirmBeforeJumping = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T) => true | NavigatorJumpRouteFunction;
interface RouterCommandConfiguration {
    methodNameCommandResolver: () => MethodNameCommandResolver;
    navigatorAdapter: () => NavigatorAdapter;
    navigatorContextAdapter: () => NavigatorContextAdapter;
    confirmBeforeJumping?: () => RouteConfirmBeforeJumping;
}

/**
 * app command router factory
 *
 * @param configuration
 * @param pathPrefix   automatically supplemented prefix
 * @param autoJoinQueryString
 */
declare const appCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>>(configuration: RouterCommandConfiguration, pathPrefix?: string, autoJoinQueryString?: boolean) => T;

export { AppCommandRouter, NavigatorAdapter, NavigatorContextAdapter, NavigatorDescriptorObject, RouteConfirmBeforeJumping, RouteUriVariable, RouterCommand, RouterCommandConfiguration, RouterCommandMethod, appCommandRouterFactory };
