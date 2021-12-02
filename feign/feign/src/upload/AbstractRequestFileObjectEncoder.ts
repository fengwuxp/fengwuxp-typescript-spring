import {HttpRequestDataEncoder} from "../codec/HttpRequestDataEncoder";
import {FeignRequestOptions} from '../FeignRequestOptions';
import {getRequestFeignClientMethodConfiguration} from "../context/RequestContextHolder";
import {FileUploadStrategy} from "./FileUploadStrategy";
import {HttpMethod} from '../constant/http/HttpMethod';
import {AutoFileUploadOptions} from "../annotations/upload/FileUpload";


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


    protected constructor(fileUploadStrategy: FileUploadStrategy<any>) {
        this.fileUploadStrategy = fileUploadStrategy;
    }

    async encode(request: T): Promise<T> {

        const {requestMapping, fileUploadOptions} = getRequestFeignClientMethodConfiguration(request) ?? {};
        if (requestMapping == null || fileUploadOptions == null) {
            return request;
        }
        if (AbstractRequestFileObjectEncoder.SUPPORT_REQUEST_METHODS.indexOf(requestMapping.method) < 0) {
            return request;
        }
        const data = request.body;
        const uploadQueue = this.getUploadQueue(data, fileUploadOptions);
        if (uploadQueue.length === 0) {
            return request;
        }

        const fileUploadProgressBar = this.fileUploadStrategy.fileUploadProgressBar;
        const closeProgressBarFn = fileUploadProgressBar.showProgressBar(request.fileUploadProgressBar);
        await Promise.all(uploadQueue.map(async ({key, isArray, value}) => {
            //并发上传文件
            const result: string[] = await Promise.all((value).map((item, index) => {
                return this.uploadFile(item, index, request);
            }));
            // 覆盖参数值，文件对象--> 远程url
            if (isArray) {
                data[key] = result;
            } else {
                data[key] = result.join(",");
            }

        })).finally(closeProgressBarFn);

        return request;


    }

    /**
     * 获取文件上传队列
     * @param data
     * @param fileUploadOptions
     */
    protected getUploadQueue = (data: any, fileUploadOptions): Array<{
        key: string,
        isArray: boolean,
        value: any[]
    }> => {
        //找出要上传的文件对象，加入到上传的队列中
        const uploadQueue: Array<{
            key: string,
            isArray: boolean,
            value: any[]
        }> = [];

        for (const key in data) {
            const val = data[key];
            if (val == null) {
                continue;
            }
            const isArray = Array.isArray(val);
            //如果是是数组 使用第一个元素去判断
            const value = isArray ? val[0] : val;
            if (value == null) {
                continue;
            }
            if (!this.attrIsNeedUpload(key, value, fileUploadOptions)) {
                continue;
            }

            uploadQueue.push({
                key,
                isArray,
                value: isArray ? val : [val]
            });
        }
        return uploadQueue;
    };

    /**
     * 上传
     * @param value
     * @param index
     * @param request
     */
    protected uploadFile = (value, index: number, request: Readonly<T>): Promise<string> => this.fileUploadStrategy.upload(value, index, request).then((result) => {
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
