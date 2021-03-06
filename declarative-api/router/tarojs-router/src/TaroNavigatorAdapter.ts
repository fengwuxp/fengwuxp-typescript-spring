import {
    NavigatorAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import Taro from "@tarojs/taro";
import {setNextViewState} from './PageStatTransferHelper';


export default class TaroNavigatorAdapter implements NavigatorAdapter {


    private customRouteMapping: Record<string, string>;


    constructor(customRouteMapping?: Record<string, string>) {
        this.customRouteMapping = customRouteMapping;
    }

    goBack = (num?: number, ...args: any[]) => {
        return Taro.navigateBack();
    };

    popAndPush = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.replace(descriptorObject, uriVariables, state);
    };

    push = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        setNextViewState((descriptorObject as NavigatorDescriptorObject).state);
        return Taro.navigateTo({
            url: (descriptorObject as NavigatorDescriptorObject).pathname
        })
    };

    toView = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.push(descriptorObject, uriVariables, state);
    };


    popToTop = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.reLaunch(descriptorObject);
    };


    reLaunch = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        setNextViewState((descriptorObject as NavigatorDescriptorObject).state);
        if (process.env.TARO_ENV === 'h5') {
            const url = location.href.substr(0, location.href.indexOf("/pages/")) + (descriptorObject as NavigatorDescriptorObject).pathname;
            window.location.replace(url);
        } else {
            return Taro.reLaunch({
                url: (descriptorObject as NavigatorDescriptorObject).pathname
            })
        }

    };


    replace = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        setNextViewState((descriptorObject as NavigatorDescriptorObject).state);
        if (process.env.TARO_ENV === 'h5') {
            const url = location.href.substr(0, location.href.indexOf("/pages/")) + (descriptorObject as NavigatorDescriptorObject).pathname;
            window.location.replace(url);
        } else {
            return Taro.redirectTo({url: (descriptorObject as NavigatorDescriptorObject).pathname})
        }
    };

    switchTab = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        setNextViewState((descriptorObject as NavigatorDescriptorObject).state);
        return Taro.switchTab({url: (descriptorObject as NavigatorDescriptorObject).pathname})
    };

    protected getPageUrl = (url) => {
        const {customRouteMapping} = this;
        if (customRouteMapping == null) {
            return null;
        }

    }


}
