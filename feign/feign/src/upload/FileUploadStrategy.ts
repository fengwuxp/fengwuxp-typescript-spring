import {FeignRequestOptions} from "../FeignRequestOptions";
import {FileUploadProgressBar} from "../ui/FileUploadProgressBar";

export interface FileUploadStrategyResultInterface {

    url: string;
}

export type FileUploadStrategyResult = FileUploadStrategyResultInterface | string

/**
 * file upload strategy
 * Used to automatically upload files when requested and convert them to urls
 * {@see HttpRequestDataEncoder}
 */
export interface FileUploadStrategy<T> {

    /**
     * upload file
     * @param file object
     * @param index
     * @param request
     * @return  default file remote url
     */
    upload: (file: T, index: number, request: FeignRequestOptions) => Promise<FileUploadStrategyResult>

    /**
     * 文件上传 {@link FileUploadProgressBar}
     */
    fileUploadProgressBar: Readonly<FileUploadProgressBar>;
}
