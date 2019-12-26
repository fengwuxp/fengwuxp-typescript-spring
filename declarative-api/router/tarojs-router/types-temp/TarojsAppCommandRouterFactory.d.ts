import { AppCommandRouter, NavigatorAdapter, NavigatorContextAdapter, NavigatorDescriptorObject, RouteConfirmBeforeJumping } from "fengwuxp-declarative-router-adapter";
/**
 *
 * @param pathPrefix              路径前缀，如果有分包可以设置为 /分包目录名称/pages/  ==>  /shop/pages/
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
export declare const tarojsAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(pathPrefix?: string, confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorAdapter?: NavigatorAdapter<NavigatorDescriptorObject>, navigatorContextAdapter?: NavigatorContextAdapter<NavigatorDescriptorObject>) => T;
