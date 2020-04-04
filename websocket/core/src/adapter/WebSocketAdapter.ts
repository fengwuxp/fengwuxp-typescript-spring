import {WebSocketLifeCycle} from "./WebSocketLifeCycle";

/**
 * web socket  adapter
 * {@see WebSocketLifeCycle}
 * {@see WebSocketConnectionConfiguration}
 */
export interface WebSocketAdapter extends WebSocketLifeCycle {


    /**
     * send data to server
     * {@see MarsSocketProtocol}
     * @param data
     */
    send: (data: any) => void;

    /**
     * close current websocket connection
     * @param code
     * @param reason
     */
    close: (code?: number, reason?: string) => void;


}
