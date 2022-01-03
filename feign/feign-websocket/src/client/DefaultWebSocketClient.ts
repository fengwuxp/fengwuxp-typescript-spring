import {WebSocketClient} from "./WebSocketClient";
import {TextByteMessage, WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";
import {WebSocketMessageEventConsumer, WebSocketMessageEventSubscriber} from "../event/WebSocketMessageEvent";
import {WebSocketAdapter} from "../WebSocketAdapter";
import {WebSocketMethodMapping} from "../annotations/WebSocketMapping";
import WebSocketEventAccessor from "../event/WebSocketEventAccessor";
import WebSocketClientInterceptorAccessor from "./WebSocketClientInterceptorAccessor";
import {DefaultFeignLog4jFactory} from "fengwuxp-typescript-feign";


const METHOD_MAPPINGS = {
    [WebSocketMethodMapping.OPEN]: "onOpen",
    [WebSocketMethodMapping.ERROR]: "onError",
    [WebSocketMethodMapping.CLOSE]: "onClose",
}

export default class DefaultWebSocketClient implements WebSocketClient {


    private static LOG = DefaultFeignLog4jFactory.getLogger(DefaultWebSocketClient.name);

    private readonly delegate: WebSocketAdapter;

    private readonly clientInterceptorAccessor: WebSocketClientInterceptorAccessor;

    private readonly eventAccessor: WebSocketEventAccessor;

    constructor(delegate: WebSocketAdapter, clientInterceptorAccessor: WebSocketClientInterceptorAccessor, eventAccessor: WebSocketEventAccessor) {
        this.delegate = delegate;
        this.clientInterceptorAccessor = clientInterceptorAccessor;
        this.eventAccessor = eventAccessor;
        this.registerMessageListen();
    }

    private registerMessageListen = () => {
        this.delegate.onMessage(this.receiveMessage);
    }

    private receiveMessage = async (data: WebSocketMessageMediaType) => {
        if (DefaultWebSocketClient.LOG.isTraceEnabled()) {
            DefaultWebSocketClient.LOG.debug("receive message", data);
        }

        const {delegate, clientInterceptorAccessor, eventAccessor} = this;
        const message: TextByteMessage = new TextByteMessage(data);

        // decode message
        clientInterceptorAccessor.response(message).then(result => {
            if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
                DefaultWebSocketClient.LOG.debug("publish event message", result);
            }
            eventAccessor.publishEvent(result.getPayload());
        }).catch((error) => {
            DefaultWebSocketClient.LOG.error("parse receive message failure", error);
        });
    }

    close = (code?: number, reason?: string): void => {
        this.delegate.close(code, reason);
    }

    send = <T>(message: WebSocketMessage<T>): void => {
        if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
            DefaultWebSocketClient.LOG.debug("request message", message);
        }

        const {clientInterceptorAccessor, delegate} = this;
        // encode message
        clientInterceptorAccessor.request(message).then((result) => {
            if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
                DefaultWebSocketClient.LOG.debug("send message", result);
            }
            const payload = result.getPayload();
            if (Array.isArray(payload)) {
                payload.forEach((data) => {
                    delegate.send(data)
                })
            } else {
                delegate.send(payload)
            }
        }).catch((error) => {
            DefaultWebSocketClient.LOG.error("send message failure", error);
        });
    }

    subscribe = <M>(eventType: string, consumer: WebSocketMessageEventConsumer<M>): WebSocketMessageEventSubscriber => {
        if (DefaultWebSocketClient.LOG.isDebugEnabled()) {
            DefaultWebSocketClient.LOG.debug("subscribe event", eventType);
        }
        return this.eventAccessor.subscribe(eventType, consumer);
    }

    /**
     * 订阅连接事件
     * @param eventType
     * @param consumer
     */
    subscribeLifeCycleEvent = (eventType: string, consumer: WebSocketMessageEventConsumer): WebSocketMessageEventSubscriber => {
        const onMethodName = METHOD_MAPPINGS[eventType];
        const webSocketAdapter = this.delegate;
        webSocketAdapter[onMethodName](consumer);
        return {
            eventType,
            remove: () => webSocketAdapter[onMethodName](() => {
            })
        }
    }

}