import {
    NavigatorContextAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import {parse} from "querystring";
import {History} from "history";


export default class BrowserNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
    implements NavigatorContextAdapter<T> {

    private history: History;

    constructor(history: History = window["g_history"]) {
        this.history = history;
    }

    getBrowseHistory = () => {
        throw new Error("not support");
    };

    getCurrentObject = (): T => {
        const location = this.history.location;
        return {
            search: location.search,
            state: location.state,
            hash: location.hash,
            key: location.key,
            pathname: this.getCurrentPathname(),
            uriVariables: this.getCurrentUriVariables()
        } as T;
    };

    getCurrentPathname = () => location.hostname;

    getCurrentState = <S = RouteUriVariable>() => this.history.location.state;

    getCurrentUriVariables = <S = RouteUriVariable>() => parse(location.search.substring(1)) as any;

    isStackTop = () => this.history.length === 1;

    isView = (pathname: string) => this.getCurrentPathname() === pathname;

    onStateChange = (preState, currentState) => {
        if (this.isStackTop()) {

        } else {

        }

    }
}
