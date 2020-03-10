import {RequestProgressBar} from "./RequestProgressBar";
import {FileUploadProgressBarOptions} from "../FeignRequestOptions";


/**
 * file upload progressbar
 */
export interface FileUploadProgressBar extends RequestProgressBar<FileUploadProgressBarOptions> {


    /**
     *
     * @param progress  upload progress
     * @param fileIndex  Few files
     */
    onUploadProgressChange:(progress:number,fileIndex:number)=>void;
}
