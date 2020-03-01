import {AppCommandBroadcaster, appCommandBroadcasterFactory} from "fengwuxp-declarative-broadcast-adapter";
import BrowserEventBroadcastAdapter from './BrowserEventBroadcastAdapter';


/**
 *
 * @param pathPrefix
 */
export const browserAppCommandBroadcasterFactory = <T extends AppCommandBroadcaster>(pathPrefix?: string) => {


    return appCommandBroadcasterFactory<T>({
        broadcastAdapter: () => new BrowserEventBroadcastAdapter()
    }, pathPrefix);
};
