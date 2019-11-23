import { AppCommandRouter, NavigatorAdapter, NavigatorDescriptorObject, RouteConfirmBeforeJumping, RouteUriVariable } from 'fengwuxp-declarative-router-adapter';

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
    popToTop: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    toView: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    push: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    reLaunch: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    replace: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    private jump;
    private genRouteProps;
}

export { ReactNativeNavigatorAdapter, reactNativeAppCommandRouterFactory };
