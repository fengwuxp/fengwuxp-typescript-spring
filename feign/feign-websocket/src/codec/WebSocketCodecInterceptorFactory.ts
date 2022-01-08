import {
    MessageDecoder,
    MessageDecoderInterface,
    MessageEncoder,
    MessageEncoderInterface
} from "./WebSocketMessageCodec";
import {converterFunctionInterface} from "fengwuxp-typescript-feign";
import {WebSocketClientInterceptorFunction} from "../client/WebSocketClientInterceptor";
import {WebSocketMessage} from "../WebSocketMessage";

const encodeMethod = "encode";
const decodeMethod = "decode";

type CodecInterceptors<T = any> = {
    encode: WebSocketClientInterceptorFunction<T>,
    decode: WebSocketClientInterceptorFunction<T>,
};
/**
 * @param encoders
 * @param decoders
 *
 */
export const codecInterceptorsFactory = <T = any>(encoders: MessageEncoder<T>[], decoders: MessageDecoder<T>[]): CodecInterceptors<T> => {

    const encodeHandlers: MessageEncoderInterface<T>[] = converterHandlers<MessageEncoder<T>, MessageEncoderInterface<T>>(encoders, encodeMethod);
    const decodeHandlers: MessageEncoderInterface<T>[] = converterHandlers<MessageDecoder<T>, MessageDecoderInterface<T>>(decoders, decodeMethod);

    return {
        encode: (messages, context) => {
            return invokeHandlers(encodeHandlers, encodeMethod, messages, context);
        },
        decode: (messages, context) => {
            return invokeHandlers(decodeHandlers, decodeMethod, messages, context);
        }
    }
}


const invokeHandlers = async (handlers: any[], method: string, messages, context: any): Promise<WebSocketMessage<any>[]> => {
    for (const handler of handlers) {
        const result = await handler[method](messages, context);
        if (result != null) {
            return result;
        }
    }
    throw new Error(`unsupported ${method} message`);
}

const converterHandlers = <T, I>(handlers: any[], method: string) => {
    return handlers.map(converterFunctionInterface)
}