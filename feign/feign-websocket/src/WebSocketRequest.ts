import {FeignRequestContextOptions} from "fengwuxp-typescript-feign";
import {WebSocketMessage} from "./WebSocketMessage";


export interface WebSocketRequestContext {

    [key: string]: any
}

export interface WebSocketRequest<T = any, C = WebSocketRequestContext> {

    context?: C

    message: WebSocketMessage<T>
}


export interface FeignWebSocketRequestOptions extends WebSocketRequest, FeignRequestContextOptions {

}

export const createWebSocketRequest = <T = any>(message: WebSocketMessage<T>, context?: WebSocketRequestContext): WebSocketRequest<T> => {
    return {
        message,
        context: context ?? {}
    }
}


export const combineObjectAttributes = <C extends object =object>(context: C, defaultContext?: C): C => {
    return {
        ...(defaultContext ?? {} as C),
        ...(context ?? {} as C)
    }
}