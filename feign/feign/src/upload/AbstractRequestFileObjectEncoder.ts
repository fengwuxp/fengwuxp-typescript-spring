import {HttpRequestDataEncoder} from "../codec/HttpRequestDataEncoder";
import {FeignRequestOptions} from '../FeignRequestOptions';
import {getFeignClientMethodConfiguration} from "../context/RequestContextHolder";
import {FileUploadStrategy} from "./FileUploadStrategy";
import {HttpMethod} from '../constant/http/HttpMethod';
import {AutoFileUploadOptions} from "../annotations/upload/FileUpload";
import {FileUploadProgressBar} from "../ui/FileUploadProgressBar";


/**
 * abstract request file object
 */
export abstract class AbstractRequestFileObjectEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {

    /**
     * 文件上传策略
     */
    protected fileUploadStrategy: FileUploadStrategy<any>;


    /**
     * 支持的请求方法列表
     */
    protected static SUPPORT_REQUEST_METHODS = [HttpMethod.POST, HttpMethod.PATCH, HttpMethod.PUT];


    constructor(fileUploadStrategy: FileUploadStrategy<any>) {
        this.fileUploadStrategy = fileUploadStrategy;
    }

    async encode(request: T): Promise<T> {

        const {requestMapping, fileUploadOptions} = getFeignClientMethodConfiguration(request.requestId);
        if (AbstractRequestFileObjectEncoder.SUPPORT_REQUEST_METHODS.indexOf(requestMapping.method) < 0) {
            return request;
        }
        const data = request.body;
        const uploadQueue = this.getUploadQueue(data, fileUploadOptions);
        if (uploadQueue.length > 0) {
            const fileUploadStrategy = this.fileUploadStrategy.fileUploadStrategy();
            fileUploadStrategy.showProgressBar(request.fileUploadProgressBar);
            await Promise.all(uploadQueue.map(async ({key, value}, index) => {
                //并发上传文件
                const val = value[0];
                if (val.constructor === Array) {
                    return {
                        key,
                        value: await Promise.all((val as any).map((item, index) => {
                            return this.uploadFile(item, index, request);
                        }))
                    }
                }
                return {
                    key,
                    value: await this.uploadFile(val, index, request)
                }
            })).then((values) => {
                values.forEach(({key, value}) => {
                    //覆盖参数值，文件对象--> 远程url
                    data[key] = value;
                });
            }).finally(fileUploadStrategy.hideProgressBar);

        }

        return request;


    }

    protected getUploadQueue = (data: any, fileUploadOptions) => {
        //找出要上传的文件对象，加入到上传的队列中
        const uploadQueue: Array<{
            key: string,
            value: Promise<any>[]
        }> = [];

        for (const key in data) {
            const val = data[key];
            if (this.attrIsNeedUpload(key, val, fileUploadOptions)) {
                uploadQueue.push({
                    key,
                    value: [val]
                });
            }
        }
        return uploadQueue;
    };

    /**
     * 上传
     * @param value
     * @param index
     * @param request
     */
    protected uploadFile = (value, index: number, request: Readonly<T>): Promise<string> => this.fileUploadStrategy.upload(value,index, request).then((result) => {
        if (typeof result == "string") {
            return result
        } else {
            return result.url;
        }
    });


    /**
     * 判断请求body中的属性是否需要进行文件上传
     */
    abstract attrIsNeedUpload: (name: string, value, options: AutoFileUploadOptions) => boolean;


}
