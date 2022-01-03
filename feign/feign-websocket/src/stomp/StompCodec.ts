import {StompFrame} from "./StompFrame";
import {WebSocketMessageMediaType} from "../WebSocketMessage";


/**
 * stomp： https://stomp.yueplus.ink/stomp-specification-1.2.html
 */
export default class StompCodec {

    private readonly _encoder = new TextEncoder();

    private readonly _decoder = new TextDecoder();

    decode = (segment: WebSocketMessageMediaType, appendMissingNULLonIncoming: boolean = false): StompFrame => {
        let chunk: Uint8Array;
        if (typeof segment === "string") {
            chunk = this._encoder.encode(segment);
        } else {
            chunk = new Uint8Array(segment);
        }
        // Send a NULL byte, if the last byte of a Text frame was not NULL.F
        if (appendMissingNULLonIncoming && chunk[chunk.length - 1] !== 0) {
            const chunkWithNull = new Uint8Array(chunk.length + 1);
            chunkWithNull.set(chunk, 0);
            chunkWithNull[chunk.length] = 0;
            chunk = chunkWithNull;
        }

        // TODO
        return {
            command: null,
            headers: {},
            body: ""
        }
    }

    encode = (frame: StompFrame): WebSocketMessageMediaType => {

        // TODO
        return "";
    }

}