import {FeignWebSocketRequestOptions} from "../FeignWebSocketRequestOptions";
import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "./WebSocketMessageEvent";


/**
 * Web socket message Sender
 */
export type WebSocketMessageSender<T> = (data: T, options?: FeignWebSocketRequestOptions) => void;




export type WebSocketMessageObserver<T = any> = (consumer: WebSocketMessageEventConsumer<T>) => WebSocketMessageEventSubscriber;

