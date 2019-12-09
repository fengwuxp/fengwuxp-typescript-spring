import {AppCommandBroadcaster, appCommandBroadcasterFactory} from "fengwuxp-declarative-broadcast-adapter";
import {DeviceEventEmitter} from "react-native";


/**
 *
 * @param pathPrefix
 */
export const reactNativeAppCommandBroadcasterFactory = <T extends AppCommandBroadcaster>(pathPrefix?: string) => {


    return appCommandBroadcasterFactory<T>({
        broadcastAdapter: () => DeviceEventEmitter
    }, pathPrefix);
};
