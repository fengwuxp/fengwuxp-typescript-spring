import { FeignClient } from "../../FeignClient";
/**
 * 需要自动上传配置
 */
export interface AutoFileUploadOptions {
    /**
     * 需要执行上传动作的字段
     */
    fields: Array<string>;
    /**
     * 上传的rul
     */
    url?: string;
}
/**
 * @param options  需要自动上传
 * @constructor
 */
export declare const FileUpload: <T extends FeignClient>(options: AutoFileUploadOptions) => Function;
