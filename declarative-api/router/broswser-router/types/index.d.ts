import { AppCommandRouter, NavigatorDescriptorObject, NavigatorAdapter, RouteConfirmBeforeJumping, NavigatorContextAdapter, RouteUriVariable } from 'fengwuxp-declarative-router-adapter';
import { History } from 'history';

/**
 *
 * @param navigatorAdapter
 * @param confirmBeforeJumping
 * @param navigatorContextAdapter
 * @param modulePathPrefix
 */
declare const browserNativeAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(navigatorAdapter: NavigatorAdapter<NavigatorDescriptorObject>, confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorContextAdapter?: NavigatorContextAdapter<NavigatorDescriptorObject>, modulePathPrefix?: string) => T;

declare class BrowserNavigatorAdapter implements NavigatorAdapter {
    private history;
    constructor(history: History);
    goBack: (num?: number, ...args: any[]) => void;
    popAndPush: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    push: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    toView: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    popToTop: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    reLaunch: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    replace: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
}

declare class BrowserNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorContextAdapter<T> {
    private browseHistory;
    constructor();
    getBrowseHistory: () => T[];
    getCurrentObject: () => T;
    getCurrentPathname: () => string;
    getCurrentState: <S = RouteUriVariable>() => any;
    getCurrentUriVariables: <S = RouteUriVariable>() => any;
    isStackTop: () => boolean;
    isView: (pathname: string) => boolean;
    onStateChange: (preState: any, currentState: any) => void;
}

export { BrowserNavigatorAdapter, BrowserNavigatorContextAdapter, browserNativeAppCommandRouterFactory };
