import {OnClose, OnError, OnMessageMapping, OnOpen, SendMessageMapping} from "../src/annotations/WebSocketMapping";
import {FeignWebsocket} from "../src/annotations/FeignWebsocket";
import {WebSocketMessageObserver, WebSocketMessageSender} from "../src/event/WebSocketMessageHander";

export interface TestExample {
    name: string
}

@FeignWebsocket({url: "ws://localhost:18081/ws"})
export default class TestWebSocketFeignClient {

    @SendMessageMapping({value: "/create/example"})
    createExample: WebSocketMessageSender<TestExample>

    @OnOpen()
    onOpen: WebSocketMessageObserver<Event | any>;

    @OnError()
    onError: WebSocketMessageObserver<Event | any>;

    @OnClose()
    onClose: WebSocketMessageObserver<CloseEvent | any>;

    @OnMessageMapping({value: "/example"})
    getExample: WebSocketMessageObserver<TestExample>;

}