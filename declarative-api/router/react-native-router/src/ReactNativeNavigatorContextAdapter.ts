import {
    NavigatorContextAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import {Actions} from "react-native-router-flux";


/**
 * react native navigator context adapter
 */
export default class ReactNativeNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
    implements NavigatorContextAdapter<T> {

    private browseHistory: T[] = [];

    constructor() {


        Actions.onStateChange((preState, currentState) => {
            if (this.isStackTop()) {
                this.browseHistory = [];
            } else {
                this.browseHistory.pop();
            }
            this.browseHistory.push(this.getCurrentObject());
        });


    }

    getBrowseHistory = () => this.browseHistory;

    getCurrentObject = (): T => {
        return {
            pathname: this.getCurrentPathname(),
            state: this.getCurrentState()
        } as T;
    };

    getCurrentPathname = () => Actions.currentScene;

    getCurrentState = <S = RouteUriVariable>() => Actions.currentParams as any;

    getCurrentUriVariables = <S = RouteUriVariable>() => this.getCurrentState();

    isStackTop = () => Actions.state["index"] === 0;

    isView = (pathname: string) => this.getCurrentPathname() === pathname;


}

