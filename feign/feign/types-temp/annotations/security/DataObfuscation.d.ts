/**
 * 数据混淆配置
 */
import { FeignClient } from "../../FeignClient";
export interface DataObfuscationOptions {
    /**
     * 请求数据中需要混淆的数据
     */
    requestFields?: string[];
    /**
     * 响应数据中被混淆的数据
     */
    responseFields?: string[];
}
/**
 * @param options 数据混淆
 * @constructor
 */
export declare const DataObfuscation: <T extends FeignClient>(options: DataObfuscationOptions) => Function;
