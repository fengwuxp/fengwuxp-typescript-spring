import {AbstractResource} from "./AbstractResource";
import * as path from "path";
import {pathToFileURL, URL} from "url";

/**
 *
 */
export class FileSystemResource extends AbstractResource {

    private filePath: string;

    private url: URL;

    private filename: string;

    constructor(filePath: string) {
        super();
        this.filePath = filePath;
        this.url = pathToFileURL(filePath);
        const strings = filePath.split(path.sep);
        this.filename = strings.pop();
    }

    getDescription = () => {
        return ""
    };
    getFilename = () => {

        return this.filename;
    };
    getURL = () => {
        return this.url
    };


}
