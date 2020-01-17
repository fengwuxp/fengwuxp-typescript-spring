import {
    AppCommandRouter,
    appCommandRouterFactory,
    NavigatorAdapter,
    NavigatorContextAdapter,
    RouteConfirmBeforeJumping, RouterCommandConfiguration
} from "fengwuxp-declarative-router-adapter";
import TarojsNavigatorContextAdapter from "./TarojsNavigatorContextAdapter";
import {MethodNameCommandResolver, repeatTheFirstWord} from "fengwuxp-declarative-command";
import TaroNavigatorAdapter from "./TaroNavigatorAdapter";


/**
 * 获取路由配置
 * @param methodNameCommandResolver
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
export const getRouterCommandConfiguration = (confirmBeforeJumping?: RouteConfirmBeforeJumping,
                                              methodNameCommandResolver?: MethodNameCommandResolver,
                                              navigatorAdapter?: NavigatorAdapter,
                                              navigatorContextAdapter?: NavigatorContextAdapter): RouterCommandConfiguration => {

    return {
        confirmBeforeJumping: () => confirmBeforeJumping,
        methodNameCommandResolver: () => methodNameCommandResolver || repeatTheFirstWord,
        navigatorAdapter: (): NavigatorAdapter => navigatorAdapter || new TaroNavigatorAdapter(),
        navigatorContextAdapter: (): NavigatorContextAdapter => navigatorContextAdapter || new TarojsNavigatorContextAdapter()
    }
};

/**
 *
 * @param pathPrefix              路径前缀，如果有分包可以设置为 /分包目录名称/pages/  ==>  /shop/pages/
 * @param methodNameCommandResolver
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
export const tarojsAppCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter = NavigatorAdapter>(pathPrefix: string = "/pages/",
                                                   confirmBeforeJumping?: RouteConfirmBeforeJumping,
                                                   methodNameCommandResolver?: MethodNameCommandResolver,
                                                   navigatorAdapter?: NavigatorAdapter,
                                                   navigatorContextAdapter?: NavigatorContextAdapter) => {

    return appCommandRouterFactory<T>(
        getRouterCommandConfiguration(confirmBeforeJumping, methodNameCommandResolver, navigatorAdapter, navigatorContextAdapter),
        pathPrefix,
        true);
};
