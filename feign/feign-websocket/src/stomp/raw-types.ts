import {StompCommand} from "./StompCommand";

export type RawHeaderType = [string, string];

/**
 * The parser yield frames in this structure
 *
 * Part of `@stomp/stompjs`.
 *
 * @internal
 */
export interface IRawFrameType {
    command: StompCommand;
    headers: RawHeaderType[];
    binaryBody: Uint8Array;
}