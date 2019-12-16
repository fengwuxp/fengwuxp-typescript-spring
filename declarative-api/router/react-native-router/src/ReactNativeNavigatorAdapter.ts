import {NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable} from "fengwuxp-declarative-router-adapter";
import {Actions} from "react-native-router-flux"

/**
 * react-native navigator adapter
 */
export default class ReactNativeNavigatorAdapter implements NavigatorAdapter<NavigatorDescriptorObject> {

    goBack = (num?: number, ...args: any[]) => {

        num = Math.abs(num || 1) || 1;
        while (num-- > 0) {
            Actions.pop();
        }
    };

    popToTop = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(Actions.popTo, descriptorObject, uriVariables, state);

    };
    toView = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {

        return this.jump(Actions.push, descriptorObject, uriVariables, state);

    };

    push = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(Actions.push, descriptorObject, uriVariables, state);
    };

    reLaunch = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(Actions.reset, descriptorObject, uriVariables, state);
    };

    replace = (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(Actions.replace, descriptorObject, uriVariables, state);
    };

    private jump = (action: (sceneKey: string, props?: any) => void, descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        if (typeof descriptorObject === "string") {
            descriptorObject = {
                pathname: descriptorObject,
                uriVariables,
                state
            }
        }

        // const [pathname, queryString] = descriptorObject.pathname.split("?");
        return action(descriptorObject.pathname, this.genRouteProps(descriptorObject));
    };

    private genRouteProps = (descriptorObject: NavigatorDescriptorObject) => {

        const {state, uriVariables} = descriptorObject;
        if (state == null && uriVariables == null) {
            return {};
        }
        return {
            ...(uriVariables as any),
            ...state
        }
    }


}
