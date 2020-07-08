import {
    AbstractRequestFileObjectEncoder,
    AutoFileUploadOptions,
    FileUploadProgressBar,
    FileUploadStrategy
} from "fengwuxp-typescript-feign";
import AlibabaCloudOssFileUploadStrategy from "./AlibabaCloudOssFileUploadStrategy";
import {AlibabaCloudOssFactory} from '../factory/AlibabaCloudOssFactory';
import {MultipartOptions} from "ali-oss";

const isBrowser = () => typeof window !== "undefined";

/**
 * 基于阿里云oss 的文件上传
 */
export default class AlibabaCloudOssFileObjectEncoder extends AbstractRequestFileObjectEncoder {

    // 开启base64格式支持
    private enabledSupportBase64: boolean;

    constructor(alibabaCloudOssFactory: AlibabaCloudOssFactory,
                fileUploadProgressBar: FileUploadProgressBar,
                multipartOptions?: MultipartOptions,
                enabledSupportBase64: boolean = false) {
        super(new AlibabaCloudOssFileUploadStrategy(alibabaCloudOssFactory, fileUploadProgressBar, multipartOptions));
        this.enabledSupportBase64 = enabledSupportBase64;
    }

    attrIsNeedUpload = (name: string, value: any, options: AutoFileUploadOptions) => {

        if (isBrowser()) {
            // 浏览器
            if (value.constructor === File || value.constructor === Blob) {
                // 文件对象
                return true;
            }
            // 是否base64字符串
            if (this.enabledSupportBase64) {
                if (typeof value === "string" && value.startsWith("data:image/")) {
                    return true;
                }
            }
        }

        if (options == null || options.fields == null || options.fields.length == 0) {
            return false;
        }
        return options.fields.includes(name);

    };
}
