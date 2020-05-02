import {NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable} from "fengwuxp-declarative-router-adapter";
import {history} from 'umi';


export default class UmiBrowserNavigatorAdapter implements NavigatorAdapter {



    goBack = (num?: number, ...args: any[]) => {
        if (num == null) {
            return history.goBack()
        }
        return history.go(num);
    };

    popAndPush = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        const object = descriptorObject as NavigatorDescriptorObject;
        return history.replace(object.pathname,object.state);
    };

    push = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        const object = descriptorObject as NavigatorDescriptorObject;
        return history.push(object.pathname,object.state);
    };

    toView = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.push(descriptorObject, uriVariables, state);
    };


    popToTop = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.reLaunch(descriptorObject);
    };


    reLaunch = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        const length = history.length;
        history.go(0 - length);
        return this.replace(descriptorObject);
    };


    replace = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        const object = descriptorObject as NavigatorDescriptorObject;
        return history.replace(object.pathname, object.state)
    };


}
