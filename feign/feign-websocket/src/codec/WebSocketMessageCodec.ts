import {WebSocketMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";
import {WebSocketRequestContext} from "../WebSocketRequest";


/**
 * not supported encode or decode return null
 */
type CodecResult<T> = Promise<Array<WebSocketMessage<T>> | null> | Array<WebSocketMessage<T>> | null | undefined;


export type MessageDecoderFunction<T, C = WebSocketRequestContext> = (message: WebSocketMessage<WebSocketMessageOriginalType>, context: C) => CodecResult<T>;

export interface MessageDecoderInterface<T, C = WebSocketRequestContext> {

    decode: MessageDecoderFunction<T, C>
}


export type MessageEncoderFunction<T, C = WebSocketRequestContext> = (message: WebSocketMessage<T>, context: C) => CodecResult<WebSocketMessageOriginalType>;

export interface MessageEncoderInterface<T, C = WebSocketRequestContext> {

    encode: MessageEncoderFunction<T>
}


export type MessageDecoder<T> = MessageDecoderFunction<T> | MessageDecoderInterface<T>;

export type MessageEncoder<T> = MessageEncoderFunction<T> | MessageEncoderInterface<T>;