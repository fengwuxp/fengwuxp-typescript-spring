import {FeignHttpConfiguration} from "../configuration/FeignHttpConfiguration";
import {FeignProxyClient} from "../support/FeignProxyClient";
import {FeignClientType, generateFeignClientAnnotation} from "./FeignClientAnnotationFactory";


export const FEIGN_HTTP: FeignClientType = "http";

/**
 * Mark a class as feign　client
 * @param options
 * @constructor
 */
export const Feign = generateFeignClientAnnotation<FeignHttpConfiguration, FeignProxyClient<FeignHttpConfiguration>>(FEIGN_HTTP);