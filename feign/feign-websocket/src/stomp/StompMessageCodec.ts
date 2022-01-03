import {MessageDecoderInterface, MessageEncoderInterface,} from "../codec/WebSocketMessageCodec";
import {ObjectMessage, TextByteMessage, WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";
import {StompFrame} from "./StompFrame";
import {DefaultFeignLog4jFactory} from "fengwuxp-typescript-feign";
import StompCodec from "./StompCodec";


export default class StompMessageCodec implements MessageDecoderInterface<StompFrame>, MessageEncoderInterface<StompFrame> {
    constructor(stompCodec: StompCodec) {
        this.stompCodec = stompCodec;
    }

    private static LOG = DefaultFeignLog4jFactory.getLogger(StompMessageCodec.name);

    private readonly stompCodec: StompCodec;

    decode = (message: WebSocketMessage<WebSocketMessageMediaType>): Promise<WebSocketMessage<StompFrame>> | WebSocketMessage<StompFrame> => {
        const frame = this.stompCodec.decode(message.getPayload());
        return new ObjectMessage(frame, message.getPayloadLength());
    }

    encode = (message: WebSocketMessage<StompFrame>): Promise<WebSocketMessage<WebSocketMessageMediaType>> | WebSocketMessage<WebSocketMessageMediaType> => {
        const text = this.stompCodec.encode(message.getPayload());
        return new TextByteMessage(text);
    }


}