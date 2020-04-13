import {
    NavigatorContextAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import Taro from "@tarojs/taro";
import {PAGE_VIEW_STATE} from "./PageStatTransferHelper";


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

    getCurrentPathname = () => {
        const currentPages = Taro.getCurrentPages();
        if (currentPages == null || currentPages.length == 0) {
            return null;
        }
        return currentPages.pop().route
    };

    getCurrentState = () => {
        const result = Taro.getStorageSync(PAGE_VIEW_STATE);
        if (result == null) {
            return null;
        }
        return result.data;
    }

    getCurrentUriVariables = <S = RouteUriVariable>() => null

    isStackTop = () => false;

    isView = (pathname: string) => this.getCurrentPathname() === pathname;


}
