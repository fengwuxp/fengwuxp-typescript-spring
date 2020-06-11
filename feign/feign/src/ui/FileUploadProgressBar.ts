import {RequestProgressBar} from "./RequestProgressBar";
import {FileUploadProgressBarOptions} from "../FeignRequestOptions";


/**
 * file upload progressbar
 */
export interface FileUploadProgressBar extends RequestProgressBar<FileUploadProgressBarOptions> {


    /**
     *
     * @param progress  upload progress
     * @param fileIndex
     */
    onUploadProgressChange:(progress:number,fileIndex:number)=>void;
}
