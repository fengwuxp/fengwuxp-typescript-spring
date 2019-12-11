import {
    NavigatorContextAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import {parse} from "querystring";


export default class BrowserNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
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

    getCurrentPathname = () => location.hostname;

    getCurrentState = <S = RouteUriVariable>() => this.browseHistory[history.length - 1].state;

    getCurrentUriVariables = <S = RouteUriVariable>() => parse(location.search.substring(1)) as any;

    isStackTop = () => history.length === 1;

    isView = (pathname: string) => this.getCurrentPathname() === pathname;

    onStateChange = (preState, currentState) => {
        if (this.isStackTop()) {
            this.browseHistory = [];
        } else {
            this.browseHistory.pop();
        }
        this.browseHistory.push(this.getCurrentObject());
    }
}
