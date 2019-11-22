import {NavigatorAdapter, NavigatorDescriptorObject} from "fengwuxp-declarative-router-adapter";
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

    popToTop = (descriptorObject: NavigatorDescriptorObject) => {

        return Actions.popTo(descriptorObject.pathname, this.genRouteProps(descriptorObject))

    };

    push = (descriptorObject: NavigatorDescriptorObject) => {
        return Actions.push(descriptorObject.pathname, this.genRouteProps(descriptorObject));
    };

    reLaunch = (descriptorObject: NavigatorDescriptorObject) => {
        return Actions.reset(descriptorObject.pathname, this.genRouteProps(descriptorObject));
    };

    replace = (descriptorObject: NavigatorDescriptorObject) => {
        return Actions.replace(descriptorObject.pathname, this.genRouteProps(descriptorObject));
    };

    private genRouteProps = (descriptorObject: NavigatorDescriptorObject) => {

        const {state, uriVariables} = descriptorObject;
        if (state == null && uriVariables == null) {
            return
        }
        return {
            ...(uriVariables as any),
            ...state
        }
    }


}
