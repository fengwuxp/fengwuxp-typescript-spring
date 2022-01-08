import {WebSocketClientInterceptor, WebSocketClientInterceptorInterface} from "./WebSocketClientInterceptor";
import {WebSocketMessage, WebSocketMessageOriginalType} from "../WebSocketMessage";
import {converterFunctionInterface} from "fengwuxp-typescript-feign";
import {WebSocketRequest, WebSocketRequestContext} from "../WebSocketRequest";


export interface WebSocketMessageContext<T = any> {

    messages: WebSocketMessage<T>[];

    context: WebSocketRequestContext;
}

export default class WebSocketClientInterceptorAccessor {

    private readonly requestInterceptors: WebSocketClientInterceptorInterface<any>[];

    private readonly responseInterceptors: WebSocketClientInterceptorInterface<any>[];

    constructor(requestInterceptors: WebSocketClientInterceptor[], responseInterceptors: WebSocketClientInterceptor[]) {
        this.requestInterceptors = this.converterInterceptors(requestInterceptors);
        this.responseInterceptors = this.converterInterceptors(requestInterceptors);
    }

    request = (request: WebSocketRequest): Promise<WebSocketMessageContext<WebSocketMessageOriginalType>> => {
        return this.invokeInterceptors(this.requestInterceptors, request);
    }

    response = (request: WebSocketRequest<WebSocketMessageOriginalType>): Promise<WebSocketMessageContext<any>> => {
        return this.invokeInterceptors(this.responseInterceptors, request);
    }

    private invokeInterceptors = async (interceptors: WebSocketClientInterceptorInterface<any>[], request: WebSocketRequest): Promise<WebSocketMessageContext> => {
        let messages: WebSocketMessage<any>[] = [request.message];
        const context = request.context ?? {};
        for (const interceptor of interceptors) {
            messages = await interceptor.intercept(messages, context);
        }
        return {
            messages,
            context: request
        };
    }

    private converterInterceptors = (interceptors: WebSocketClientInterceptor[]) => {
        return interceptors.map(interceptor => {
            return converterFunctionInterface<WebSocketClientInterceptor, WebSocketClientInterceptorInterface<any>>(interceptor);
        })
    }
}