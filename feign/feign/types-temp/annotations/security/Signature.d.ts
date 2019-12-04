import { FeignClient } from "../../FeignClient";
/**
 * 签名配置
 */
export interface SignatureOptions {
    /**
     * 要签名的字段名称
     */
    fields: Array<string>;
}
/**
 * @param options 签名配置
 * @constructor
 */
export declare const Signature: <T extends FeignClient>(options: SignatureOptions) => Function;
