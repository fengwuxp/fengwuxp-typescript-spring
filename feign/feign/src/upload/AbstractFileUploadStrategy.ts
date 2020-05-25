import {FileUploadStrategy, FileUploadStrategyResult} from "./FileUploadStrategy";
import {FeignRequestOptions} from '../FeignRequestOptions';
import {FileUploadProgressBar} from "../ui/FileUploadProgressBar";


export abstract class AbstractFileUploadStrategy<T> implements FileUploadStrategy<T> {

    private _fileUploadProgressBar: FileUploadProgressBar;


    constructor(fileUploadProgressBar: FileUploadProgressBar) {
        this._fileUploadProgressBar = fileUploadProgressBar;
    }

    abstract upload: (file: T, index: number, request: FeignRequestOptions) => Promise<FileUploadStrategyResult>;


    get fileUploadProgressBar(): FileUploadProgressBar {
        return this._fileUploadProgressBar;
    }

}
