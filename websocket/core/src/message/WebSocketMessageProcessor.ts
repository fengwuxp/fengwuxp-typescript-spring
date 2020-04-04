import {WebSocketAdapter} from "../adapter/WebSocketAdapter";

/**
 * Handling specific types of data
 */
export interface WebSocketMessageProcessor<T> {

    /**
     * handle data
     * {@see MarsSocketProtocol#commandId}
     * {@see MarsSocketProtocol#body}
     * @param data
     * @param websocket
     */
    process: (data: T, websocket: WebSocketAdapter) => void;
}
