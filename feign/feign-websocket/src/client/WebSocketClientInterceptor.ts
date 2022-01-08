import {WebSocketRequestContext} from "../WebSocketRequest";
import {WebSocketMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";

export interface WebSocketEventClientContextHolder extends WebSocketRequestContext {

    writeAndFlush: (data: WebSocketMessageOriginalType) => void;

    publishEvent: (event: WebSocketMessage<any>) => void;

    /**
     * close web socket client
     */
    close: () => void;
}


/**
 *  Intercept the given request, and return a response
 */

export type WebSocketClientInterceptorFunction<T> = (messages: WebSocketMessage<any>[], context: WebSocketRequestContext) => Promise<WebSocketMessage<T>[]> | WebSocketMessage<T>[];

export interface WebSocketClientInterceptorInterface<T> {

    intercept: WebSocketClientInterceptorFunction<T>;
}

export type WebSocketClientInterceptor<T = any> =
    WebSocketClientInterceptorFunction<T>
    | WebSocketClientInterceptorInterface<T>;