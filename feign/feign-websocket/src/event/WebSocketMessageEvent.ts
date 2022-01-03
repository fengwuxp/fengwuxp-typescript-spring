export interface WebSocketMessageEventSubscriber<EventType = string> {

    /**
     * Message type
     */
    readonly eventType: EventType;

    /**
     * Removes this subscription from the subscriber that controls it.
     */
    remove(): void;
}


export type WebSocketMessageEventConsumer<T = any> = (data: T) => void;

export interface WebSocketMessageEventPublisher {

    publish: (eventType: string, data: any) => void;
}

export interface WebSocketMessageEventListener {

    on: (eventType: string, consumer: WebSocketMessageEventConsumer) => WebSocketMessageEventSubscriber;

}

export interface EventMessage<T = any> {

    data?: T;

    event: string;
}

export type WebSocketMessageExtractorFunction<T> = (data: any) => EventMessage<T>

export interface WebSocketMessageExtractorInterface<T> {

    extractData: WebSocketMessageExtractorFunction<T>;
}

export type WebSocketMessageExtractor<T = any> =
    WebSocketMessageExtractorFunction<T>
    | WebSocketMessageExtractorInterface<T>;