import {StompCommand} from "./StompCommand";


export type StompHeaders = Record<string, string>;

/**
 * It represents a STOMP frame. Many of the callbacks pass an IFrame received from
 * the STOMP broker. For advanced usage you might need to access [headers]{@link StompFrame#headers}.
 *
 * Part of `@stomp/stompjs`.
 *
 * stomp docs： https://stomp.yueplus.ink/
 */
export interface StompFrame {

    command: StompCommand,

    /**
     * body of the frame as string
     */
    readonly body: string;

    headers: StompHeaders

    /**
     * Is this frame binary (based on whether body/binaryBody was passed when creating this frame).
     */
    isBinaryBody: boolean;


    /**
     * body as Uint8Array
     */
    readonly binaryBody: Uint8Array;
}
