import {BaseFeignClientConfiguration} from "fengwuxp-typescript-feign";
import {WebSocketAdapter} from "../WebSocketAdapter";
import {WebSocketMessageEventListener, WebSocketMessageEventPublisher} from "../event/WebSocketMessageEvent";


export interface FeignWebSocketConfiguration extends BaseFeignClientConfiguration {

    /**
     * get websocket adapter
     */
    getWebSocketAdapter: () => WebSocketAdapter;


    getWebSocketMessageEventPublisher?: () => WebSocketMessageEventPublisher

    getWebSocketMessageEventListener?: () => WebSocketMessageEventListener
}