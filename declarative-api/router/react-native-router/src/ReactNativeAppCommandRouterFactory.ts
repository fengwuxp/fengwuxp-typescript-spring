import {
    AppCommandRouter,
    appCommandRouterFactory,
    NavigatorAdapter, NavigatorDescriptorObject,
    RouteConfirmBeforeJumping
} from "fengwuxp-declarative-router-adapter";
import ReactNativeNavigatorAdapter from "./ReactNativeNavigatorAdapter";
import {toLineResolver} from "fengwuxp-declarative-command";


/**
 *
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 */
export const reactNativeAppCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter=NavigatorAdapter>(confirmBeforeJumping: RouteConfirmBeforeJumping,
                                                           navigatorAdapter?: NavigatorAdapter) => {

    return appCommandRouterFactory<T, N>(
        {
            confirmBeforeJumping: () => confirmBeforeJumping,
            methodNameCommandResolver: () => toLineResolver,
            navigatorAdapter: (): NavigatorAdapter => navigatorAdapter || new ReactNativeNavigatorAdapter()
        },"");
};
