import {
    AppCommandRouter,
    appCommandRouterFactory,
    NavigatorAdapter, NavigatorContextAdapter, NavigatorDescriptorObject,
    RouteConfirmBeforeJumping
} from "fengwuxp-declarative-router-adapter";
import {toLineResolver} from "fengwuxp-declarative-command";
import BrowserNavigatorContextAdapter from "./BrowserNavigatorContextAdapter";


/**
 *
 * @param navigatorAdapter
 * @param confirmBeforeJumping
 * @param navigatorContextAdapter
 * @param modulePathPrefix
 */
export const browserNativeAppCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter = NavigatorAdapter>(navigatorAdapter: NavigatorAdapter,
                                                   confirmBeforeJumping?: RouteConfirmBeforeJumping,
                                                   navigatorContextAdapter?: NavigatorContextAdapter,
                                                   modulePathPrefix?: string) => {
    return appCommandRouterFactory<T>(
        {
            confirmBeforeJumping: () => confirmBeforeJumping,
            methodNameCommandResolver: () => toLineResolver,
            navigatorAdapter: (): NavigatorAdapter => navigatorAdapter,
            navigatorContextAdapter: (): NavigatorContextAdapter => navigatorContextAdapter || new BrowserNavigatorContextAdapter()
        }, modulePathPrefix, false);
};
