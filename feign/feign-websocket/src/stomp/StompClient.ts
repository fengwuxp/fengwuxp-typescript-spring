import {WebSocketClient} from "../client/WebSocketClient";
import {WebSocketRequest} from "../WebSocketRequest";
import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "../event/WebSocketMessageEvent";
import {WebSocketMethodMapping} from "../annotations/WebSocketMapping";


export default class StompClient implements WebSocketClient {

    close = (code: number | undefined, reason: string | undefined): void => {
    }

    send = <T>(request: WebSocketRequest<T>): void => {
    }

    subscribe = <M>(eventType: string, consumer: WebSocketMessageEventConsumer<M>): WebSocketMessageEventSubscriber => {
        return undefined;
    }

    subscribeLifeCycleEvent = (eventType: Exclude<WebSocketMethodMapping, "SEND" | "MESSAGE">, consumer: WebSocketMessageEventConsumer<any>): WebSocketMessageEventSubscriber => {
        return undefined;
    }

}