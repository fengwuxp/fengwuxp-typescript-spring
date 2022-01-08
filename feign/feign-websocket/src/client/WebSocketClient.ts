import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "../event/WebSocketMessageEvent";
import {WebSocketMethodMapping} from "../annotations/WebSocketMapping";
import {WebSocketRequest} from "../WebSocketRequest";


export interface WebSocketClient {

    send: <T = any>(request: WebSocketRequest<T>) => void;

    subscribe: <M = any>(eventType: string, consumer: WebSocketMessageEventConsumer<M>) => WebSocketMessageEventSubscriber;

    /**
     * 生命周期事件
     * 默认：仅支持订阅一次，重复订阅将会覆盖前面的订阅
     * @param eventType
     * @param consumer
     */
    subscribeLifeCycleEvent: (eventType: Exclude<WebSocketMethodMapping, "SEND" | "MESSAGE">, consumer: WebSocketMessageEventConsumer<Event | any>) => WebSocketMessageEventSubscriber;

    close: (code?: number, reason?: string) => void;
}