export interface WebSocketMessage<T> {

    getPayload: () => T;

    getPayloadLength: () => number;
}


export type WebSocketMessageOriginalType = string | Uint8Array | ArrayBuffer


/**
 * 字符串或字节消息
 */
export class TextByteMessage implements WebSocketMessage<WebSocketMessageOriginalType> {

    private readonly data: WebSocketMessageOriginalType;

    private readonly length: number;

    constructor(data: WebSocketMessageOriginalType) {
        this.data = data;
        this.length = this.getDataLength(data);
    }

    private getDataLength = (data: WebSocketMessageOriginalType) => {
        if (data == null) {
            return 0
        }

        if (typeof data === "string") {
            return data.length;
        }

        if (data.constructor === ArrayBuffer) {
            return data.byteLength;
        }

        if (data.constructor === Uint8Array) {
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