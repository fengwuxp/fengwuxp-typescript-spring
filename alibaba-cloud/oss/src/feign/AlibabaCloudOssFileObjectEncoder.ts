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


    constructor(alibabaCloudOssFactory: AlibabaCloudOssFactory,
                fileUploadProgressBar: FileUploadProgressBar,
                multipartOptions?: MultipartOptions) {
        super(new AlibabaCloudOssFileUploadStrategy(alibabaCloudOssFactory, fileUploadProgressBar, multipartOptions));
    }

    attrIsNeedUpload = (name: string, value: any, options: AutoFileUploadOptions) => {

        if (isBrowser()) {
            // 浏览器
            if (value.constructor === File || value.constructor === Blob) {
                // 文件对象
                return true;
            }
        }

        if (options == null || options.fields == null || options.fields.length == 0) {
            return false;
        }
        return options.fields.includes(name);

    };
}
