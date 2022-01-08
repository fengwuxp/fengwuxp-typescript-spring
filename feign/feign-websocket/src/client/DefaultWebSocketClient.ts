import {WebSocketClient} from "./WebSocketClient";
import {TextByteMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";
import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "../event/WebSocketMessageEvent";
import {WebSocketAdapter} from "../WebSocketAdapter";
import {WebSocketMethodMapping} from "../annotations/WebSocketMapping";
import WebSocketEventAccessor from "../event/WebSocketEventAccessor";
import WebSocketClientInterceptorAccessor from "./WebSocketClientInterceptorAccessor";
import {DefaultFeignLog4jFactory} from "fengwuxp-typescript-feign";
import {createWebSocketRequest, WebSocketRequest} from "../WebSocketRequest";
import {KeepHearBeatConnection} from "../heartbeat/KeepHearBeatConnection";


const METHOD_CONSUMERS = {
    [WebSocketMethodMapping.OPEN]: [],
    [WebSocketMethodMapping.ERROR]: [],
    [WebSocketMethodMapping.CLOSE]: [],
}

const wrapperLifeCycleConsumer = (mapping: WebSocketMethodMapping) => {
    return (event) => {
        METHOD_CONSUMERS[mapping].forEach(consumer => consumer(event))
    }
}

const listenLifeCycleEvent = (eventType: WebSocketMethodMapping, consumer: WebSocketMessageEventConsumer): WebSocketMessageEventSubscriber => {
    METHOD_CONSUMERS[eventType].push(consumer);
    return {
        eventType,
        remove: () => {
            const index = METHOD_CONSUMERS[eventType].findIndex(item => item == consumer);
            METHOD_CONSUMERS[eventType].splice(index, 1);
        }
    }
}

export default class DefaultWebSocketClient implements WebSocketClient {

    private static LOG = DefaultFeignLog4jFactory.getLogger(DefaultWebSocketClient.name);

    private readonly delegate: WebSocketAdapter;

    private readonly connection: KeepHearBeatConnection;

    private readonly clientInterceptorAccessor: WebSocketClientInterceptorAccessor;

    private readonly eventAccessor: WebSocketEventAccessor;

    constructor(delegate: WebSocketAdapter, connection: KeepHearBeatConnection, clientInterceptorAccessor: WebSocketClientInterceptorAccessor, eventAccessor: WebSocketEventAccessor) {
        this.delegate = delegate;
        this.connection = connection;
        this.clientInterceptorAccessor = clientInterceptorAccessor;
        this.eventAccessor = eventAccessor;
        this.configureSocketConnection();
        this.registerMessageListen();
    }

    private configureSocketConnection = () => {
        const {delegate, connection} = this;

        delegate.onOpen(wrapperLifeCycleConsumer(WebSocketMethodMapping.OPEN))
        delegate.onClose(wrapperLifeCycleConsumer(WebSocketMethodMapping.CLOSE))
        delegate.onError(wrapperLifeCycleConsumer(WebSocketMethodMapping.ERROR))

        const eventSubscribers: WebSocketMessageEventSubscriber[] = [
            listenLifeCycleEvent(WebSocketMethodMapping.OPEN, () => connection.start()),
            listenLifeCycleEvent(WebSocketMethodMapping.CLOSE, () => connection.close()),
            listenLifeCycleEvent(WebSocketMethodMapping.ERROR, () => connection.close()),
        ]

        connection.onClose(() => {
            // 关闭 socket
            delegate.close();

            // 移除事件监听
            eventSubscribers.forEach(subscriber => subscriber.remove());
        });
    }

    private registerMessageListen = () => {
        this.delegate.onMessage(this.receiveMessage);
    }

    private receiveMessage = async (data: WebSocketMessageOriginalType) => {
        if (DefaultWebSocketClient.LOG.isTraceEnabled()) {
            DefaultWebSocketClient.LOG.debug("receive message", data);
        }
        if (!this.connection.isConnected()) {
            DefaultWebSocketClient.LOG.error("web socket connection is close", data);
            return
        }

        this.connection.markLastServerMessageTimes();

        const {clientInterceptorAccessor, eventAccessor} = this;
        const message: TextByteMessage = new TextByteMessage(data);

        // decode message
        clientInterceptorAccessor.response(this.createOnMessageRequest(message)).then(({messages, context}) => {
            if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
                DefaultWebSocketClient.LOG.debug("publish event messages ", messages);
            }
            messages.map(item => item.getPayload()).forEach(eventAccessor.publishEvent);
        }).catch((error) => {
            DefaultWebSocketClient.LOG.error("parse receive message failure", error);
        });
    }

    /**
     * subclass can override
     * @param message
     */
    protected createOnMessageRequest = (message: TextByteMessage) => {
        return createWebSocketRequest(message);
    }

    close = (code?: number, reason?: string): void => {
        if (this.connection.isConnected()) {
            this.connection.close();
        }
    }

    send = <T>(request: WebSocketRequest<T>): void => {
        if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
            DefaultWebSocketClient.LOG.debug("websocket request = ", request);
        }

        const {clientInterceptorAccessor, delegate} = this;
        // encode message
        clientInterceptorAccessor.request(request).then(({messages, context}) => {
            if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
                DefaultWebSocketClient.LOG.debug("send messages ", messages);
            }
            messages.map(item => item.getPayload()).forEach(delegate.send);
        }).catch((error) => {
            DefaultWebSocketClient.LOG.error("send message failure", error);
        });
    }

    subscribe = <M>(eventType: string, consumer: WebSocketMessageEventConsumer<M>): WebSocketMessageEventSubscriber => {
        if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
            DefaultWebSocketClient.LOG.debug("subscribe message event", eventType);
        }
        return this.eventAccessor.subscribe(eventType, consumer);
    }

    /**
     * 订阅连接事件
     * @param eventType
     * @param consumer
     */
    subscribeLifeCycleEvent = (eventType: Exclude<WebSocketMethodMapping, "SEND" | "MESSAGE">, consumer: WebSocketMessageEventConsumer): WebSocketMessageEventSubscriber => {
        return listenLifeCycleEvent(eventType, consumer)
    }


}