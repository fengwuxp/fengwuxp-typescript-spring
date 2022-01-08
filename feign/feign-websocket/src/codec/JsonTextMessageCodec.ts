import {MessageDecoderInterface, MessageEncoderInterface} from "./WebSocketMessageCodec";
import {ObjectMessage, TextByteMessage, WebSocketMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";
import {WebSocketRequestContext} from "../WebSocketRequest";


/**
 * 解析 json text
 */
export default class JsonTextMessageCodec implements MessageDecoderInterface<any>, MessageEncoderInterface<any> {

    decode = (message: WebSocketMessage<WebSocketMessageOriginalType>, context: WebSocketRequestContext) => {
        const payload = message.getPayload();
        if (typeof payload === "string") {
            return [new ObjectMessage(JSON.parse(payload), message.getPayloadLength())];
        }
        // not supported return null
        return null;
    }

    encode = (message: WebSocketMessage<any>, context: WebSocketRequestContext) => {
        // TODO 判断是否为 object ?
        const text = JSON.stringify(message.getPayload());
        return [new TextByteMessage(text)];
    }

}