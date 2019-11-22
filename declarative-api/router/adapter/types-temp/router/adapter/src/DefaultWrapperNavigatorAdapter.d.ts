import { NavigatorAdapter, NavigatorDescriptorObject } from "./NavigatorAdapter";
import { RouteConfirmBeforeJumping } from "./RouterCommandConfiguration";
/**
 * wrapper navigator
 */
export default class DefaultWrapperNavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorAdapter<T> {
    private navigatorAdapter;
    private confirmBeforeJumping;
    private pathPrefix;
    constructor(navigatorAdapter: NavigatorAdapter<NavigatorDescriptorObject>, confirmBeforeJumping?: RouteConfirmBeforeJumping, pathPrefix?: string);
    goBack: (num?: number, ...args: any[]) => void | Promise<any>;
    popToTop: (navigatorDescriptorObject: NavigatorDescriptorObject) => any;
    push: (navigatorDescriptorObject: NavigatorDescriptorObject) => any;
    reLaunch: (navigatorDescriptorObject: NavigatorDescriptorObject) => any;
    replace: (navigatorDescriptorObject: NavigatorDescriptorObject) => any;
    private jump;
    private resolveUriVariables;
    /**
     * 尝试处理路径参数
     * @param navigatorDescriptorObject
     */
    private tryHandlePathArguments;
}
