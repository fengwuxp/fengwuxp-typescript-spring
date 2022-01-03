import {WebSocketClientInterceptor, WebSocketClientInterceptorInterface} from "./WebSocketClientInterceptor";
import {WebSocketMessage, WebSocketMessageMediaType} from "../WebSocketMessage";
import {converterFunctionInterface} from "fengwuxp-typescript-feign";


export default class WebSocketClientInterceptorAccessor {

    private readonly requestInterceptors: WebSocketClientInterceptor[];

    private readonly responseInterceptors: WebSocketClientInterceptor[];

    constructor(requestInterceptors: WebSocketClientInterceptor[], responseInterceptors: WebSocketClientInterceptor[]) {
        this.requestInterceptors = requestInterceptors;
        this.responseInterceptors = responseInterceptors;
    }

    request = (message: WebSocketMessage<any>): Promise<WebSocketMessage<WebSocketMessageMediaType>> => {
        return this.invokeInterceptors(this.requestInterceptors, message);
    }

    response = (message: WebSocketMessage<WebSocketMessageMediaType>): Promise<WebSocketMessage<any>> => {
        return this.invokeInterceptors(this.responseInterceptors, message);
    }

    private invokeInterceptors = (interceptors: WebSocketClientInterceptor[], message: WebSocketMessage<any>) => {
        return interceptors.reduce((data, interceptor) => {
            return converterFunctionInterface<WebSocketClientInterceptor, WebSocketClientInterceptorInterface<any>>(interceptor).intercept(data);
        }, message);
    }
}