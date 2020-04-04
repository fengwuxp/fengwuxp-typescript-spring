/**
 * web socket life cycle
 */
export interface WebSocketLifeCycle {


    /**
     * on connection open
     * @param {Event} event
     */
    onOpen: (event: Event | any) => void;


    /**
     * on connection close,The server is disconnected or client close {@see WebSocketAdapter#close}
     * @param {CloseEvent} event
     */
    onClose: (event: CloseEvent | any) => void;


    /**
     * on connection occur error
     * @param {Event} event
     */
    onError: (event: Event | any) => void;

    /**
     * on receive message，when a message is received, it should be distributed, not processed immediately
     * {@see WebSocketMessageRouteStrategy#route}
     * {@see WebSocketMessageProcessor#process}
     * @param {MessageEvent} event
     */
    onMessage: (event: MessageEvent | any) => void;


}
