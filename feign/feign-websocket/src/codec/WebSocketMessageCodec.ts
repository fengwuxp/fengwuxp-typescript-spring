import {WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";


export type MessageDecoderFunction<T> = (message: WebSocketMessage<WebSocketMessageMediaType>) => Promise<WebSocketMessage<T>> | WebSocketMessage<T>;

export interface MessageDecoderInterface<T> {

    decode: MessageDecoderFunction<T>
}


export type MessageEncoderFunction<T> = (message: WebSocketMessage<T>) => Promise<WebSocketMessage<WebSocketMessageMediaType>> | WebSocketMessage<WebSocketMessageMediaType>;

export interface MessageEncoderInterface<T> {

    encode: MessageEncoderFunction<T>
}


export type MessageDecoder<T> = MessageDecoderFunction<T> | MessageDecoderInterface<T>;

export type MessageEncoder<T> = MessageEncoderFunction<T> | MessageEncoderInterface<T>;