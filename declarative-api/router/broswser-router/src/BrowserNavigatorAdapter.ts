import {
    NavigatorAdapter,
    NavigatorDescriptorObject,
    RouteUriVariable
} from "fengwuxp-declarative-router-adapter";
import {History} from "history";


export default class BrowserNavigatorAdapter implements NavigatorAdapter {

    private history: History;

    constructor(history: History) {
        this.history = history;
    }

    goBack = (num?: number, ...args: any[]) => {
        if (num == null) {
            return this.history.goBack()
        }
        return this.history.go(num);
    };

    popAndPush = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.replace(descriptorObject, uriVariables, state);
    };

    push = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.history.push(descriptorObject as NavigatorDescriptorObject)
    };

    toView = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        this.push(descriptorObject, uriVariables, state);
    };


    popToTop = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.reLaunch(descriptorObject);
    };


    reLaunch = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        const length = this.history.length;
        this.history.go(0 - length);
        return this.replace(descriptorObject);
    };


    replace = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.history.replace(descriptorObject as NavigatorDescriptorObject)
    };


}
