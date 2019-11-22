import {NavigatorAdapter, NavigatorDescriptorObject} from "fengwuxp-declarative-router-adapter";
import {Actions} from "react-native-router-flux"

/**
 * react-native navigator adapter
 */
export default class ReactNativeNavigatorAdapter implements NavigatorAdapter {

    goBack = (num?: number, ...args: any[]) => {

        Actions.pop();
    };

    popToTop = (descriptorObject: NavigatorDescriptorObject) => {

    };

    push = (descriptorObject: NavigatorDescriptorObject) => {

    };

    reLaunch = (descriptorObject: NavigatorDescriptorObject) => {

    };

    replace = (descriptorObject: NavigatorDescriptorObject) => {

    };


}
