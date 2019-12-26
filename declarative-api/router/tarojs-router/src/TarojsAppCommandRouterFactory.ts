import {
    AppCommandRouter,
    appCommandRouterFactory,
    NavigatorAdapter,
    NavigatorContextAdapter,
    RouteConfirmBeforeJumping
} from "fengwuxp-declarative-router-adapter";
import TarojsNavigatorContextAdapter from "./TarojsNavigatorContextAdapter";
import {MethodNameCommandResolver, repeatTheFirstWord} from "fengwuxp-declarative-command";
import TaroNavigatorAdapter from "./TaroNavigatorAdapter";


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
                                                   methodNameCommandResolver?: MethodNameCommandResolver,
                                                   confirmBeforeJumping?: RouteConfirmBeforeJumping,
                                                   navigatorAdapter?: NavigatorAdapter,
                                                   navigatorContextAdapter?: NavigatorContextAdapter) => {

    return appCommandRouterFactory<T>(
        {
            confirmBeforeJumping: () => confirmBeforeJumping,
            methodNameCommandResolver: () => methodNameCommandResolver || repeatTheFirstWord,
            navigatorAdapter: (): NavigatorAdapter => navigatorAdapter || new TaroNavigatorAdapter(),
            navigatorContextAdapter: (): NavigatorContextAdapter => navigatorContextAdapter || new TarojsNavigatorContextAdapter()
        }, pathPrefix, true);
};
