import {FeignClientType, FeignProxyClient, generateFeignClientAnnotation} from "fengwuxp-typescript-feign";
import {FeignWebSocketConfiguration} from "../configuration/FeignWebSocketConfiguration";


export const FEIGN_WEBSOCKET: FeignClientType = "ws";
/**
 * Mark a class as feign　client
 * @param options
 * @constructor
 */
export const FeignWebsocket = generateFeignClientAnnotation<FeignWebSocketConfiguration, FeignProxyClient<FeignWebSocketConfiguration>>(FEIGN_WEBSOCKET);