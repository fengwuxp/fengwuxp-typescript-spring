import {ObjectMessage, TextByteMessage, WebSocketMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";
import {StompFrame} from "./StompFrame";
import {DefaultFeignLog4jFactory} from "fengwuxp-typescript-feign";
import {StompFrameImpl} from "./stomp-frame-impl";
import {combineObjectAttributes} from "../WebSocketRequest";
import {StompFrameParser} from "./stomp-frame-parser";
import {MessageDecoderInterface, MessageEncoderInterface} from "../codec/WebSocketMessageCodec";


export interface StompCodecContextOptions {

    escapeHeaderValues: boolean;

    skipContentLengthHeader: boolean;

    appendMissingNULLonIncoming: boolean;
}

export interface StompMessageCodecOptions extends StompCodecContextOptions {

    /**
     * 如果小于等于则切割 frame
     */
    maxFrameSize: number;

    forceBinaryWSFrames: boolean;
}

const defaultCodecContext: StompMessageCodecOptions = {

    escapeHeaderValues: false,

    skipContentLengthHeader: false,

    appendMissingNULLonIncoming: false,

    maxFrameSize: -1,

    forceBinaryWSFrames: false,
}


export default class StompMessageCodec implements MessageDecoderInterface<StompFrame, StompCodecContextOptions>, MessageEncoderInterface<StompFrame, StompCodecContextOptions> {

    private static LOG = DefaultFeignLog4jFactory.getLogger(StompMessageCodec.name);

    private codecOptions: StompMessageCodecOptions;

    private readonly stompFrameParser: StompFrameParser;

    private readonly frameCaches: StompFrame[] = [];

    constructor(codecOptions?: StompMessageCodecOptions) {
        this.codecOptions = combineObjectAttributes<StompMessageCodecOptions>(codecOptions, defaultCodecContext);
        this.stompFrameParser = new StompFrameParser(((rawFrame) => {
            const frame = StompFrameImpl.fromRawFrame(rawFrame, this.codecOptions.escapeHeaderValues);
            this.frameCaches.push(frame);
        }), () => {
            if (StompMessageCodec.LOG.isDebugEnabled()) {
                StompMessageCodec.LOG.debug("receive pong message");
            }
        });
    }


    decode = (message: WebSocketMessage<WebSocketMessageOriginalType>, context: StompCodecContextOptions): Promise<Array<WebSocketMessage<StompFrame>>> | Array<WebSocketMessage<StompFrame>> => {
        const {stompFrameParser, frameCaches} = this;

        return new Promise(resolve => {
            // 解析
            stompFrameParser.parseChunk(message.getPayload(), context.appendMissingNULLonIncoming || false);

            // 解析完成
            const frames = frameCaches.splice(0, this.frameCaches.length);
            const messages: WebSocketMessage<StompFrame>[] = frames.map(frame => {
                return new ObjectMessage<StompFrame>(frame, frame.binaryBody.length);
            });

            resolve(messages);
        })
    }

    encode = (message: WebSocketMessage<StompFrame>, context: StompCodecContextOptions): Promise<Array<WebSocketMessage<WebSocketMessageOriginalType>>> | Array<WebSocketMessage<WebSocketMessageOriginalType>> => {
        const payload = message.getPayload();

        // TODO
        this.codecOptions = combineObjectAttributes<StompMessageCodecOptions>(this.codecOptions, defaultCodecContext);

        const rawChunk = StompFrameImpl.marshall({
            ...payload,
            ...this.codecOptions
        });

        return this.converterFrames(rawChunk).map(frame => {
            return new TextByteMessage(frame);
        })
    }


    private converterFrames = (rawChunk: WebSocketMessageOriginalType): WebSocketMessageOriginalType[] => {
        const {forceBinaryWSFrames} = this.codecOptions;

        if (forceBinaryWSFrames && typeof rawChunk === 'string') {
            rawChunk = new TextEncoder().encode(rawChunk);
        }

        if (typeof rawChunk === "string") {
            return this.spiltFrames(rawChunk);
        }

        return [rawChunk];
    }

    private spiltFrames = (text: string): string[] => {
        const {maxFrameSize} = this.codecOptions;
        if (maxFrameSize <= 0) {
            // un split
            return [text];
        }

        const result = [];
        while (text.length > maxFrameSize) {
            result.push(text.substr(0, maxFrameSize));
            text = text.substring(maxFrameSize);
        }
        result.push(text)
        return result;
    }
}