import {WebSocketClient} from "./WebSocketClient";
import {WebSocketRequest} from "../WebSocketRequest";
import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "../event/WebSocketMessageEvent";
import {WebSocketMethodMapping} from "../annotations/WebSocketMapping";
import {KeepHearBeatConnection} from "../heartbeat/KeepHearBeatConnection";


/**
 * 用于保持 web socket 连接，除非手动 close
 */
export default class WebSocketConnectionHolder implements WebSocketClient {

    private readonly delegate: WebSocketClient;

    private readonly connection:KeepHearBeatConnection;

    constructor(delegate: WebSocketClient) {
        this.delegate = delegate;
    }

    close = (code: number | undefined, reason: string | undefined): void => {
        this.delegate.close(code, reason);
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