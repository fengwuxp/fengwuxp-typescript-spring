import {WebSocketMessageEventConsumer} from "./event/WebSocketMessageEvent";
import {WebSocketMessageMediaType} from "./WebSocketMessage";

export interface WebSocketLifeCycle {

    onOpen: (handle: (event: Event | any) => void) => void;

    onError: (handle: (event: Event | any) => void) => void;

    onClose: (handle: (event: CloseEvent | any) => void) => void;

    close: (code?: number, reason?: string) => void;
}


/**
 * web socket adapter
 */
export interface WebSocketAdapter extends WebSocketLifeCycle {

    send: (data: WebSocketMessageMediaType) => void;

    onMessage: (consumer: WebSocketMessageEventConsumer<WebSocketMessageMediaType>) => void;

}

