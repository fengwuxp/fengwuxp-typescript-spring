import {BYTE} from './byte';

import {StompFrame, StompHeaders} from "./StompFrame";
import {StompCommand} from "./StompCommand";
import {IRawFrameType} from "./raw-types";

type StompFrameInitParams = {
    command: StompCommand;
    headers?: StompHeaders;
    body?: string;
    binaryBody?: Uint8Array;
    escapeHeaderValues?: boolean;
    skipContentLengthHeader?: boolean;
};

/**
 * copy form https://github.com/stomp-js/stompjs
 * Frame class represents a STOMP frame.
 *
 * @internal
 */
export class StompFrameImpl implements StompFrame {
    /**
     * STOMP Command
     */
    public command: StompCommand;

    /**
     * Headers, key value pairs.
     */
    public headers: StompHeaders;

    /**
     * Is this frame binary (based on whether body/binaryBody was passed when creating this frame).
     */
    public isBinaryBody: boolean;

    /**
     * body of the frame
     */
    get body(): string {
        if (!this._body && this.isBinaryBody) {
            this._body = new TextDecoder().decode(this._binaryBody);
        }
        return this._body;
    }

    private _body: string;

    /**
     * body as Uint8Array
     */
    get binaryBody(): Uint8Array {
        if (!this._binaryBody && !this.isBinaryBody) {
            this._binaryBody = new TextEncoder().encode(this._body);
        }
        return this._binaryBody;
    }

    private _binaryBody: Uint8Array;

    private readonly escapeHeaderValues: boolean;

    private readonly skipContentLengthHeader: boolean;

    /**
     * Frame constructor. `command`, `headers` and `body` are available as properties.
     *
     * @internal
     */
    private constructor(params: StompFrameInitParams) {
        const {
            command,
            headers,
            body,
            binaryBody,
            escapeHeaderValues,
            skipContentLengthHeader,
        } = params;
        this.command = command;
        this.headers = (Object as any).assign({}, headers || {});

        if (binaryBody) {
            this._binaryBody = binaryBody;
            this.isBinaryBody = true;
        } else {
            this._body = body || '';
            this.isBinaryBody = false;
        }
        this.escapeHeaderValues = escapeHeaderValues || false;
        this.skipContentLengthHeader = skipContentLengthHeader || false;
    }

    /**
     *
     * deserialize a STOMP Frame from raw data.
     *
     * @internal
     */
    public static fromRawFrame(rawFrame: IRawFrameType, escapeHeaderValues: boolean): StompFrameImpl {
        const headers: StompHeaders = {};
        const trim = (str: string): string => str.replace(/^\s+|\s+$/g, '');

        // In case of repeated headers, as per standards, first value need to be used
        for (const header of rawFrame.headers.reverse()) {
            const idx = header.indexOf(':');

            const key = trim(header[0]);
            let value = trim(header[1]);

            if (StompFrameImpl.noneConnectCommand(escapeHeaderValues, rawFrame.command)) {
                value = StompFrameImpl.hdrValueUnEscape(value);
            }

            headers[key] = value;
        }

        return new StompFrameImpl({
            command: rawFrame.command,
            headers,
            binaryBody: rawFrame.binaryBody,
            escapeHeaderValues,
        });
    }

    private static noneConnectCommand(escapeHeaderValues: boolean, command: StompCommand) {
        return escapeHeaderValues && command !== StompCommand.CONNECT && command !== StompCommand.CONNECTED;
    }

    /**
     * @internal
     */
    public toString(): string {
        return this.serializeCmdAndHeaders();
    }

    /**
     * serialize this Frame in a format suitable to be passed to WebSocket.
     * If the body is string the output will be string.
     * If the body is binary (i.e. of type Unit8Array) it will be serialized to ArrayBuffer.
     *
     * @internal
     */
    public serialize(): string | ArrayBuffer {
        const cmdAndHeaders = this.serializeCmdAndHeaders();

        if (this.isBinaryBody) {
            return StompFrameImpl.toUnit8Array(cmdAndHeaders, this._binaryBody).buffer;
        } else {
            return cmdAndHeaders + this._body + BYTE.NULL;
        }
    }

    private serializeCmdAndHeaders(): string {
        const lines: Array<string> = [this.command];
        if (this.skipContentLengthHeader) {
            delete this.headers['content-length'];
        }

        for (const name of Object.keys(this.headers || {})) {
            const value = this.headers[name];
            if (StompFrameImpl.noneConnectCommand(this.escapeHeaderValues, this.command)) {
                lines.push(`${name}:${StompFrameImpl.hdrValueEscape(`${value}`)}`);
            } else {
                lines.push(`${name}:${value}`);
            }
        }
        if (
            this.isBinaryBody ||
            (!this.isBodyEmpty() && !this.skipContentLengthHeader)
        ) {
            lines.push(`content-length:${this.bodyLength()}`);
        }
        return lines.join(BYTE.LF) + BYTE.LF + BYTE.LF;
    }

    private isBodyEmpty(): boolean {
        return this.bodyLength() === 0;
    }

    private bodyLength(): number {
        const binaryBody = this.binaryBody;
        return binaryBody ? binaryBody.length : 0;
    }

    /**
     * Compute the size of a UTF-8 string by counting its number of bytes
     * (and not the number of characters composing the string)
     * @VisibleForTest
     */
    public static sizeOfUTF8(s?: string): number {
        return s ? new TextEncoder().encode(s).length : 0;
    }

    private static toUnit8Array(cmdAndHeaders: string, binaryBody: Uint8Array): Uint8Array {
        const uint8CmdAndHeaders = new TextEncoder().encode(cmdAndHeaders);
        const nullTerminator = new Uint8Array([0]);
        const uint8Frame = new Uint8Array(
            uint8CmdAndHeaders.length + binaryBody.length + nullTerminator.length
        );

        uint8Frame.set(uint8CmdAndHeaders);
        uint8Frame.set(binaryBody, uint8CmdAndHeaders.length);
        uint8Frame.set(
            nullTerminator,
            uint8CmdAndHeaders.length + binaryBody.length
        );

        return uint8Frame;
    }

    /**
     * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
     *
     * @internal
     */
    public static marshall(params: StompFrameInitParams) {
        const frame = new StompFrameImpl(params);
        return frame.serialize();
    }

    /**
     *  Escape header values
     * @VisibleForTest
     */
    public static hdrValueEscape(str: string): string {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/:/g, '\\c');
    }

    /**
     * UnEscape header values
     * @VisibleForTest
     */
    public static hdrValueUnEscape(str: string): string {
        return str
            .replace(/\\r/g, '\r')
            .replace(/\\n/g, '\n')
            .replace(/\\c/g, ':')
            .replace(/\\\\/g, '\\');
    }
}
