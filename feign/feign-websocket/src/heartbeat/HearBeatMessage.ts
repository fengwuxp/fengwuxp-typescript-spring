import {ObjectMessage, TextByteMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";


export class PingMessage extends TextByteMessage {

    constructor(data?: WebSocketMessageOriginalType) {
        super(data);
    }
}

export class PongMessage extends TextByteMessage {
    constructor(data?: WebSocketMessageOriginalType) {
        super(data);
    }
}