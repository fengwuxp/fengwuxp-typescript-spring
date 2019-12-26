import { NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable } from "fengwuxp-declarative-router-adapter";
import * as Taro from "@tarojs/taro";
export default class TaroNavigatorAdapter implements NavigatorAdapter {
    goBack: (num?: number, ...args: any[]) => Promise<Taro.General.CallbackResult>;
    popAndPush: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    push: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    toView: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    popToTop: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    reLaunch: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    replace: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
}
