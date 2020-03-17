import { FileUploadStrategy, AbstractRequestFileObjectEncoder } from 'fengwuxp-typescript-feign';
/**
 * browser文件上传的支持
 */
export default class DelegateTransformRequestFileObjectEncoder extends AbstractRequestFileObjectEncoder {
    constructor(fileUploadStrategy: FileUploadStrategy<Blob | File>);
    attrIsNeedUpload: (name: string, value: any, options: any) => boolean;
}
