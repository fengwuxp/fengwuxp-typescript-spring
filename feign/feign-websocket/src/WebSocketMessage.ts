export interface WebSocketMessage<T> {

    getPayload: () => T;

    getPayloadLength: () => number;
}


export type WebSocketMessageMediaType = string | ArrayBufferLike


/**
 * 字符串或字节消息
 */
export class TextByteMessage implements WebSocketMessage<WebSocketMessageMediaType> {

    private readonly data: WebSocketMessageMediaType;

    private readonly length: number;

    constructor(data: WebSocketMessageMediaType) {
        this.data = data;
        this.length = this.getDataLength(data);
    }

    private getDataLength = (data: string | ArrayBuffer | Blob | ArrayBufferView) => {
        if (data == null) {
            return 0
        }

        if (typeof data === "string") {
            return data.length;
        }

        if (data.constructor === ArrayBuffer) {
            return data.byteLength;
        }

        return -1;
    }

    getPayload = () => this.data;

    getPayloadLength = (): number => this.length;

}


export class ObjectMessage<T = any> implements WebSocketMessage<T> {

    private readonly message: any

    private readonly length: number;

    constructor(message: any, length: number) {
        this.message = message;
        this.length = length;
    }

    getPayload = <T>() => this.message;

    getPayloadLength = (): number => this.length;
}


export const EMPTY_MESSAGE = new TextByteMessage(null);