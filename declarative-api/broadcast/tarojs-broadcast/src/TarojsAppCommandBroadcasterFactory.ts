import {AppCommandBroadcaster, appCommandBroadcasterFactory} from "fengwuxp-declarative-broadcast-adapter";
import TarojsEventBroadcastAdapter from './TarojsEventBroadcastAdapter';


/**
 *
 * @param pathPrefix
 */
export const tarojsAppCommandBroadcasterFactory = <T extends AppCommandBroadcaster>(pathPrefix?: string) => {


    return appCommandBroadcasterFactory<T>({
        broadcastAdapter: () => new TarojsEventBroadcastAdapter()
    }, pathPrefix);
};
