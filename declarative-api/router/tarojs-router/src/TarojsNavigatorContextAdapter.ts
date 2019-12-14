import {
    NavigatorContextAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import {parse} from "querystring";


export default class TarojsNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
    implements NavigatorContextAdapter<T> {

    private browseHistory: T[] = [];

    constructor() {
    }

    getBrowseHistory = () => this.browseHistory;

    getCurrentObject = (): T => {
        return {
            pathname: this.getCurrentPathname(),
            state: this.getCurrentState(),
            uriVariables: this.getCurrentUriVariables()
        } as any;
    };

    getCurrentPathname = () => null;

    getCurrentState = <S = RouteUriVariable>() => null;

    getCurrentUriVariables = <S = RouteUriVariable>() => null;

    isStackTop = () => false;

    isView = (pathname: string) => this.getCurrentPathname() === pathname;


}
