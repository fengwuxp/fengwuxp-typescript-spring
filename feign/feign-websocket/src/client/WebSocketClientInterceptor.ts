import {WebSocketMessage} from "../WebSocketMessage";

/**
 *  Intercept the given request, and return a response
 */

export type WebSocketClientInterceptorFunction<T> = (message: WebSocketMessage<any>) => Promise<T> | T;

export interface WebSocketClientInterceptorInterface<T> {

    intercept: WebSocketClientInterceptorFunction<T>;
}

export type WebSocketClientInterceptor<T = any> =
    WebSocketClientInterceptorFunction<T>
    | WebSocketClientInterceptorInterface<T>;