import { AppCommandRouter, NavigatorDescriptorObject, NavigatorAdapter, RouteConfirmBeforeJumping, NavigatorContextAdapter, RouteUriVariable } from 'fengwuxp-declarative-router-adapter';

/**
 *
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
declare const reactNativeAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorAdapter?: NavigatorAdapter, navigatorContextAdapter?: NavigatorContextAdapter) => T;

/**
 * react-native navigator adapter
 */
declare class ReactNativeNavigatorAdapter implements NavigatorAdapter<NavigatorDescriptorObject> {
    goBack: (num?: number, ...args: any[]) => void;
    popToTop: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    toView: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    push: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    reLaunch: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    replace: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    private jump;
    private genRouteProps;
}

/**
 * react native navigator context adapter
 */
declare class ReactNativeNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorContextAdapter<T> {
    private browseHistory;
    constructor();
    getBrowseHistory: () => T[];
    getCurrentObject: () => T;
    getCurrentPathname: () => any;
    getCurrentState: <S = RouteUriVariable>() => any;
    getCurrentUriVariables: <S = RouteUriVariable>() => any;
    isStackTop: () => boolean;
    isView: (pathname: string) => boolean;
    onStateChange: (preState: any, currentState: any) => void;
}

export { ReactNativeNavigatorAdapter, ReactNativeNavigatorContextAdapter, reactNativeAppCommandRouterFactory };
