import { LocationDescriptorObject } from 'history';
import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * 路由指令
 */
declare enum RouterCommand {
    PUSH = 0,
    POP = 1,
    RESET = 2,
    REPLACE = 3,
    POP_TO_TOP = 4
}

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
     * 到某个页面
     * @param navigatorDescriptorObject
     */
    push: (navigatorDescriptorObject: T) => void | Promise<any | void>;
    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args: any[]) => void | Promise<any | void>;
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

/**
 * uri path variable
 */
declare type UriPathVariable = Array<boolean | string | number | Date>;
/**
 * query params type
 */
declare type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;
declare type RouteUriVariable = UriPathVariable | QueryParamType;
/**
 * @param uriVariables
 * @param state
 * @param command
 */
declare type RouterCommandMethod = (uriVariables?: RouteUriVariable, state?: RouteUriVariable | RouterCommand, command?: RouterCommand) => Promise<void> | void;
/**
 * app command router
 */
interface AppCommandRouter extends NavigatorAdapter {
}

interface RouterCommandConfiguration {
    methodNameCommandResolver: () => MethodNameCommandResolver;
    navigatorAdapter: <E extends NavigatorAdapter = NavigatorAdapter>() => E;
}

/**
 * app command router factory
 *
 * @param configuration
 */
declare const appCommandRouterFactory: <T extends AppCommandRouter, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(configuration: RouterCommandConfiguration) => T & N;

export { AppCommandRouter, NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable, RouterCommand, RouterCommandConfiguration, RouterCommandMethod, appCommandRouterFactory };
