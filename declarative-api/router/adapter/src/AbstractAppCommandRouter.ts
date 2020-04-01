import {AppCommandRouter, RouteUriVariable} from "./AppCommandRouter";
import {NavigatorAdapter, NavigatorDescriptorObject, NavigatorJumpRouteFunction} from "./NavigatorAdapter";
import {NavigatorContextAdapter} from "./NavigatorContextAdapter";
import {AppRouterMappingConfiguration} from "./annotations/AppRouterMapping";


export class AbstractAppCommandRouter implements AppCommandRouter {

    getBrowseHistory: () => Array<NavigatorDescriptorObject>;
    getCurrentObject: () => NavigatorDescriptorObject;
    getCurrentPathname: () => string;
    getCurrentState: <S = RouteUriVariable>() => S;
    getCurrentUriVariables: <S = RouteUriVariable>() => S;
    getNavigatorAdapter: () => NavigatorAdapter;
    getNavigatorContextAdapter: () => NavigatorContextAdapter;
    goBack: (num?: number, ...args) => (void | Promise<any | void>);
    isStackTop: () => boolean;
    isView: (pathname: string) => boolean;
    popAndPush: NavigatorJumpRouteFunction;
    popToTop: NavigatorJumpRouteFunction;
    push: NavigatorJumpRouteFunction;
    reLaunch: NavigatorJumpRouteFunction;
    replace: NavigatorJumpRouteFunction;
    toView: NavigatorJumpRouteFunction;

}
