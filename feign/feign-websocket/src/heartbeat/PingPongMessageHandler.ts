import {WebSocketClient} from "../client/WebSocketClient";
import {ObjectMessage} from "../WebSocketMessage";


class PingPongMessage extends ObjectMessage<void> {

    constructor() {
        super({event: "ping"}, 0);
    }
}

export default class PingPongMessageHandler {

    private readonly client: WebSocketClient;

    /**
     * 心跳间隔毫秒数
     * @private
     */
    private readonly heartBeatInterval: number;

    constructor(client: WebSocketClient) {
        this.client = client;
    }

    start = () => {
        this.ping();
    }

    private ping = () => {
        try {
            // this.client.send({});
        } finally {
            setTimeout(this.ping, this.heartBeatInterval);
        }
    }
}