import { AppCommandRouter, NavigatorDescriptorObject, NavigatorAdapter, RouteConfirmBeforeJumping, NavigatorContextAdapter, RouteUriVariable } from 'fengwuxp-declarative-router-adapter';
import { History } from 'history';

/**
 *
 * @param navigatorAdapter
 * @param confirmBeforeJumping
 * @param navigatorContextAdapter
 * @param modulePathPrefix
 */
declare const browserNativeAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(navigatorAdapter: NavigatorAdapter, confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorContextAdapter?: NavigatorContextAdapter, modulePathPrefix?: string) => T;

declare class BrowserNavigatorAdapter implements NavigatorAdapter {
    private history;
    constructor(history: History);
    goBack: (num?: number, ...args: any[]) => void;
    popAndPush: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    push: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    toView: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    popToTop: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    reLaunch: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    replace: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
}

declare class BrowserNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorContextAdapter<T> {
    private history;
    constructor(history?: History);
    getBrowseHistory: () => never;
    getCurrentObject: () => T;
    getCurrentPathname: () => string;
    getCurrentState: <S = RouteUriVariable>() => S;
    getCurrentUriVariables: <S = RouteUriVariable>() => any;
    isStackTop: () => boolean;
    isView: (pathname: string) => boolean;
    onStateChange: (preState: any, currentState: any) => void;
}

export { BrowserNavigatorAdapter, BrowserNavigatorContextAdapter, browserNativeAppCommandRouterFactory };
