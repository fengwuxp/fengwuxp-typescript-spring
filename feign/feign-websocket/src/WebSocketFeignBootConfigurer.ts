import {WebSocketMessageEventListener, WebSocketMessageEventPublisher} from "./event/WebSocketMessageEvent";
import {WebSocketClientInterceptor} from "./client/WebSocketClientInterceptor";


class SocketFeignBootConfigurer {


    simple = () => {

    }

    stomp = () => {

    }

    codec = () => {

    }
}


class WebSocketFeignBootConfigurer {

    private _url: string;

    private _eventPublisher: WebSocketMessageEventPublisher;

    private _eventListener: WebSocketMessageEventListener

    private readonly _requestInterceptors: WebSocketClientInterceptor[] = [];

    private readonly _responseInterceptors: WebSocketClientInterceptor[] = [];

    private constructor() {
    }

    static of = () => new WebSocketFeignBootConfigurer()

    url = (url: string): WebSocketFeignBootConfigurer => {
        this._url = url;
        return this;
    }

    eventPublisher = (eventPublisher: WebSocketMessageEventPublisher): WebSocketFeignBootConfigurer => {
        this._eventPublisher = eventPublisher;
        return this;
    }

    eventListener = (eventListener: WebSocketMessageEventListener): WebSocketFeignBootConfigurer => {
        this._eventListener = eventListener;
        return this;
    }

    requestInterceptors = (...interceptors: WebSocketClientInterceptor[]): WebSocketFeignBootConfigurer => {
        this._requestInterceptors.push(...interceptors)
        return this;
    }

    responseInterceptors = (...interceptors: WebSocketClientInterceptor[]): WebSocketFeignBootConfigurer => {
        this._responseInterceptors.push(...interceptors)
        return this;
    }


    build = () => {

    }


}

// WebSocketFeignBootConfigurer.of()
//     .stomp()
//     .url("")
//     .eventPublisher(null)
//     .build()