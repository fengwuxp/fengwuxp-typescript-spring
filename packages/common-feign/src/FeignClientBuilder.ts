import {FeignClientExecutor} from "./FeignClientExecutor";


/**
 * feign client builder
 */
export interface FeignClientBuilder {


    build: <T extends FeignClientExecutor>() => T;

}
