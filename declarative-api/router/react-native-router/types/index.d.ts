import { AppCommandRouter, NavigatorAdapter, NavigatorDescriptorObject, RouteConfirmBeforeJumping } from 'fengwuxp-declarative-router-adapter';

/**
 *
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 */
declare const reactNativeAppCommandRouterFactory: <T extends AppCommandRouter, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(confirmBeforeJumping: RouteConfirmBeforeJumping, navigatorAdapter?: NavigatorAdapter<NavigatorDescriptorObject>) => T & N;

/**
 * react-native navigator adapter
 */
declare class ReactNativeNavigatorAdapter implements NavigatorAdapter<NavigatorDescriptorObject> {
    goBack: (num?: number, ...args: any[]) => void;
    popToTop: (descriptorObject: NavigatorDescriptorObject) => void;
    push: (descriptorObject: NavigatorDescriptorObject) => void;
    reLaunch: (descriptorObject: NavigatorDescriptorObject) => void;
    replace: (descriptorObject: NavigatorDescriptorObject) => void;
    private genRouteProps;
}

export { ReactNativeNavigatorAdapter, reactNativeAppCommandRouterFactory };
