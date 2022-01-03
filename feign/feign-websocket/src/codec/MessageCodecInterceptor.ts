import {WebSocketClientInterceptorInterface} from "../client/WebSocketClientInterceptor";
import {EMPTY_MESSAGE, WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";
import {
    MessageDecoder,
    MessageDecoderInterface,
    MessageEncoder,
    MessageEncoderInterface
} from "./WebSocketMessageCodec";
import {converterFunctionInterface} from "fengwuxp-typescript-feign";


export class MessageDecodeInterceptor implements WebSocketClientInterceptorInterface<WebSocketMessage<any>> {

    private readonly decoders: MessageDecoder<any>[]

    constructor(decoders: MessageDecoder<any>[]) {
        this.decoders = decoders;
    }

    intercept = async (message: WebSocketMessage<WebSocketMessageMediaType>) => {
        if (message == null || message.getPayload() == null) {
            return EMPTY_MESSAGE;
        }

        for (const decoder of this.decoders) {
            const result = await this.decode(decoder, message);
            if (result != null) {
                return result;
            }
        }
        return Promise.reject("decoder message failure");
    }


    private decode = async (decoder: MessageDecoder<any>, message: WebSocketMessage<WebSocketMessageMediaType>) => {
        const result = await converterFunctionInterface<MessageDecoder<any>, MessageDecoderInterface<any>>(decoder).decode(message);
        return result == null ? message : result;
    }
}

export class MessageEncodeInterceptor implements WebSocketClientInterceptorInterface<WebSocketMessage<WebSocketMessageMediaType>> {

    private readonly encoders: MessageEncoder<any>[]

    constructor(decoders: MessageEncoder<any>[]) {
        this.encoders = decoders;
    }

    intercept = async (message: WebSocketMessage<any>) => {
        if (message == null || message.getPayload() == null) {
            return EMPTY_MESSAGE;
        }

        for (const encoder of this.encoders) {
            const result = await this.decode(encoder, message);
            if (result != null) {
                return result;
            }
        }
        return Promise.reject("encode message failure");
    }

    private decode = async (decoder: MessageEncoder<any>, message: WebSocketMessage<WebSocketMessageMediaType>) => {
        const result = await converterFunctionInterface<MessageEncoder<any>, MessageEncoderInterface<any>>(decoder).encode(message);
        return result == null ? message : result;
    }
}