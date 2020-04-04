import {MarsSocketProtocol} from "../protocol/MarsSocketProtocol";
import {WebSocketAdapter} from "../adapter/WebSocketAdapter";


/**
 * Used to distribute data to different message processors when receiving messages
 * {@param T} Can be customized data protocol for processing
 * But it is recommended to use
 * {@see MarsSocketProtocol}
 * {@see WebSocketMessageProcessor#process}
 */

export interface WebSocketMessageRouteStrategy<T = MarsSocketProtocol> {


    /**
     * distribute data use{@see MarsSocketProtocol#commandId} or customized
     * @param data
     * @param websocket
     */
    route: (data: T, websocket: WebSocketAdapter) => void;
}
