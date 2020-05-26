import {
    FeignRequestOptions,
    FileUploadProgressBar,
    FileUploadStrategy,
    FileUploadStrategyResult
} from "fengwuxp-typescript-feign";
import {AlibabaCloudOssFactory} from "../factory/AlibabaCloudOssFactory";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import UUIDUtil from "fengwuxp-common-utils/lib/uuid/UUIDUtil";
import {Checkpoint, CommonResResponse, MultipartOptions, MultipartUploadResp} from "ali-oss";


/**
 * 阿里云oos 文件上传策略
 */
export default class AlibabaCloudOssFileUploadStrategy implements FileUploadStrategy<File | Blob | string> {

    protected alibabaCloudOssFactory: AlibabaCloudOssFactory;


    // 多文件上传配置
    protected multipartOptions: MultipartOptions;

    private _fileUploadProgressBar: FileUploadProgressBar;

    constructor(alibabaCloudOssFactory: AlibabaCloudOssFactory,
                fileUploadProgressBar: FileUploadProgressBar,
                multipartOptions?: MultipartOptions) {
        this.alibabaCloudOssFactory = alibabaCloudOssFactory;
        this._fileUploadProgressBar = fileUploadProgressBar;
        this.multipartOptions = multipartOptions || {
            parallel: 2,
            partSize: 1024 * 512
        };
    }


    get fileUploadProgressBar(): Readonly<FileUploadProgressBar> {
        return this._fileUploadProgressBar;
    }


    upload = async (file: File | Blob | string, index: number, request: FeignRequestOptions): Promise<FileUploadStrategyResult> => {

        const multipartOptions = this.multipartOptions;
        const client = await this.alibabaCloudOssFactory.factory();
        if (file.constructor === Blob) {
            file = new File([file], "", {type: file['type']});
        }
        const response = await client.multipartUpload(this.genUploadOssKey(file), file as File, {
            ...multipartOptions,
            progress: (percentage: number,
                       checkpoint: Checkpoint,
                       res: CommonResResponse) => {
                this.fileUploadProgressBar.onUploadProgressChange(percentage, index);
            }
        })

        return Promise.resolve(this.resolveUploadResult(response)[0]);
    }


    /**
     * 生成上传的文件名称
     * @param file
     */
    protected genUploadOssKey = (file: File | Blob | string) => {
        //前缀/年份/月份日期/filename.xxx
        const date = new Date();
        const days = date.getDate();
        const extName = this.getExtname(file);
        const uploadName = `${UUIDUtil.guid(16).replace(/-/g, "")}_${date.getTime()}`;
        const name = StringUtils.hasText(extName) ? `${uploadName}.${extName}` : uploadName;
        const configuration = this.alibabaCloudOssFactory.configuration;
        return `${configuration.basePath}/${date.getFullYear()}/${date.getMonth() + 1}${days < 10 ? "0" + days : days}/${name}`;
    };

    /**
     * 获取文件扩展名称
     * @param file
     */
    protected getExtname = (file: File | Blob | string) => {
        console.log("========file===>", file);
        let fileType: string;
        if (typeof file === "string") {
            try {
                fileType = file.split(";")[0].split(":")[0];
            } catch (e) {
            }
        } else {
            fileType = file.type;
        }
        if (fileType == null) {
            return null;
        }
        // image/png
        return fileType.split("/")[1];
    }

    /**
     * 解析上传结果
     * @param resp
     */
    protected resolveUploadResult = (resp: MultipartUploadResp): string[] => {
        console.log("上传结果", resp);
        const {res} = resp;
        return res.requestUrls.map(url => {
            return url.split("?")[0];
        })
    };
}
