import {FileUploadStrategy, FileUploadStrategyResult} from "./FileUploadStrategy";
import {FeignRequestOptions} from '../FeignRequestOptions';
import {FileUploadProgressBar} from "../ui/FileUploadProgressBar";


export abstract class AbstractFileUploadStrategy<T> implements FileUploadStrategy<T> {

    protected fileUploadProgressBar: FileUploadProgressBar;


    constructor(fileUploadProgressBar: FileUploadProgressBar) {
        this.fileUploadProgressBar = fileUploadProgressBar;
    }

    abstract upload: (file: T, index: number, request: FeignRequestOptions) => Promise<FileUploadStrategyResult>;

    fileUploadStrategy = () => this.fileUploadProgressBar;


}
