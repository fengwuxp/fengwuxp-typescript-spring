import { NavigatorContextAdapter, NavigatorDescriptorObject, RouteUriVariable } from "fengwuxp-declarative-router-adapter";
export default class TarojsNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorContextAdapter<T> {
    private browseHistory;
    constructor();
    getBrowseHistory: () => T[];
    getCurrentObject: () => T;
    getCurrentPathname: () => any;
    getCurrentState: <S = RouteUriVariable>() => any;
    getCurrentUriVariables: <S = RouteUriVariable>() => any;
    isStackTop: () => boolean;
    isView: (pathname: string) => boolean;
}
