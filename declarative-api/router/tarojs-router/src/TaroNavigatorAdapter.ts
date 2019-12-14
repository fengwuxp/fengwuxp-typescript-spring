import {
    NavigatorAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import * as Taro from "@tarojs/taro";
import {setNextViewState} from './PageStatTransferHelper';


export default class TaroNavigatorAdapter implements NavigatorAdapter {


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
        return Taro.reLaunch({
            url: (descriptorObject as NavigatorDescriptorObject).pathname
        })
    };


    replace = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        setNextViewState((descriptorObject as NavigatorDescriptorObject).state);
        return Taro.redirectTo({url: (descriptorObject as NavigatorDescriptorObject).pathname})
    };


}
