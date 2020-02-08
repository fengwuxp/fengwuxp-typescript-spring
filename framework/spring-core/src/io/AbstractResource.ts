import {Resource} from "./Resource";
import {fileURLToPath, URL} from "url";
import * as fs from "fs";

export abstract class AbstractResource implements Resource {

    exists = () => {
        return fs.existsSync(fileURLToPath(this.getURL()))
    };

    abstract getDescription: () => string;

    abstract getFilename: () => string;

    abstract getURL: () => URL;

    isFile = () => {
        return fs.lstatSync(fileURLToPath(this.getURL())).isFile()
    };

    isOpen = () => {
        return false;
    };

    isReadable = () => {
        return true;
    };


}
