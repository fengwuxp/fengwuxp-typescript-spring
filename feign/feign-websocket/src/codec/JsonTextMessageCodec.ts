import {MessageDecoderInterface, MessageEncoderInterface} from "./WebSocketMessageCodec";
import {ObjectMessage, TextByteMessage, WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";


export default class JsonTextMessageCodec implements MessageDecoderInterface<any>, MessageEncoderInterface<any> {

    decode = (message: WebSocketMessage<WebSocketMessageMediaType>): Promise<WebSocketMessage<any>> | WebSocketMessage<any> => {
        const payload = message.getPayload();
        if (typeof payload === "string") {
            return new ObjectMessage(JSON.parse(payload), message.getPayloadLength());
        }
        // not supported return null
        return null;
    }

    encode = (data: WebSocketMessage<any>): Promise<WebSocketMessage<WebSocketMessageMediaType>> | WebSocketMessage<WebSocketMessageMediaType> => {
        const text = JSON.stringify(data.getPayload());
        return new TextByteMessage(text);
    }

}