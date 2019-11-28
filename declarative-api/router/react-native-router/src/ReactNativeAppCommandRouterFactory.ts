import {
    AppCommandRouter,
    appCommandRouterFactory,
    NavigatorAdapter, NavigatorContextAdapter, NavigatorDescriptorObject,
    RouteConfirmBeforeJumping
} from "fengwuxp-declarative-router-adapter";
import ReactNativeNavigatorAdapter from "./ReactNativeNavigatorAdapter";
import {toLineResolver} from "fengwuxp-declarative-command";
import ReactNativeNavigatorContextAdapter from "./ReactNativeNavigatorContextAdapter";


/**
 *
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
export const reactNativeAppCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter = NavigatorAdapter>(confirmBeforeJumping?: RouteConfirmBeforeJumping,
                                                   navigatorAdapter?: NavigatorAdapter,
                                                   navigatorContextAdapter?: NavigatorContextAdapter) => {

    return appCommandRouterFactory<T>(
        {
            confirmBeforeJumping: () => confirmBeforeJumping,
            methodNameCommandResolver: () => toLineResolver,
            navigatorAdapter: (): NavigatorAdapter => navigatorAdapter || new ReactNativeNavigatorAdapter(),
            navigatorContextAdapter: (): NavigatorContextAdapter => navigatorContextAdapter || new ReactNativeNavigatorContextAdapter()
        }, "", false);
};
