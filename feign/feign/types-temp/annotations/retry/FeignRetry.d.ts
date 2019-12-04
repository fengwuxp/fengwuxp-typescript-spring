import { FeignClient } from "../../FeignClient";
import { HttpRetryOptions } from "../../client/HttpRetryOptions";
export declare const defaultOptions: HttpRetryOptions;
/**
 * 请求重试
 * @param options
 * @constructor
 */
export declare const FeignRetry: <T extends FeignClient>(options: HttpRetryOptions) => Function;
