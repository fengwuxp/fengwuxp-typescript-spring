import {WebSocketMessageProcessor} from '../message/WebSocketMessageProcessor';

/**
 * Ping pong with the server
 */
export interface HeartbeatMessageProcessor<T> extends WebSocketMessageProcessor<T> {

}

