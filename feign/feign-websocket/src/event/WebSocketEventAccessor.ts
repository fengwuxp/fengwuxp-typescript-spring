import {
    WebSocketMessageEventConsumer,
    WebSocketMessageEventListener,
    WebSocketMessageEventPublisher,
    WebSocketMessageEventSubscriber,
    WebSocketMessageExtractor,
    WebSocketMessageExtractorInterface
} from "./WebSocketMessageEvent";
import {converterFunctionInterface} from "fengwuxp-typescript-feign";


export default class WebSocketEventAccessor {

    private readonly messageEventListener: WebSocketMessageEventListener;

    private readonly messageEventPublisher: WebSocketMessageEventPublisher;

    private readonly messageExtractor: WebSocketMessageExtractorInterface<any>

    constructor(messageEventListener: WebSocketMessageEventListener, messageEventPublisher: WebSocketMessageEventPublisher, messageExtractor: WebSocketMessageExtractor) {
        this.messageEventListener = messageEventListener;
        this.messageEventPublisher = messageEventPublisher;
        this.messageExtractor = converterFunctionInterface<WebSocketMessageExtractor, WebSocketMessageExtractorInterface<any>>(messageExtractor);
    }

    subscribe = <M>(eventType: string, consumer: WebSocketMessageEventConsumer<M>): WebSocketMessageEventSubscriber => {
        return this.messageEventListener.on(eventType, consumer);
    }

    publishEvent = (data: any) => {
        const {messageExtractor, messageEventPublisher} = this;
        const {event, data: resp} = messageExtractor.extractData(data);
        messageEventPublisher.publish(event, resp);
    }

}