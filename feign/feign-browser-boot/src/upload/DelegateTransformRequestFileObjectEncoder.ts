import {
    AutoFileUploadOptions,
    FileUploadStrategy,
    AbstractRequestFileObjectEncoder
} from 'fengwuxp-typescript-feign';


/**
 * browser文件上传的支持
 */
export default class DelegateTransformRequestFileObjectEncoder extends AbstractRequestFileObjectEncoder {


    constructor(fileUploadStrategy: FileUploadStrategy<Blob | File>) {
        super(fileUploadStrategy);
    }

    attrIsNeedUpload = (name: string, value: any, options: AutoFileUploadOptions) => {
        if (value == null) {
            return false;
        }

        //判断请求参数是否存在文件对象
        if (value.constructor === File || value.constructor === Blob) {
            return true;
        }

        //是否在需要上传的列表中
        if (options != null && options.fields != null) {
            if (options.fields.findIndex((field) => field === name)) {
                return true;
            }
        }
        return false;

    };


}
