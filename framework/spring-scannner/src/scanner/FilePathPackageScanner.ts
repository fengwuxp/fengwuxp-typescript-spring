import {PackageScanner} from "./PackageScanner";
import * as fs from "fs";
import * as pathModule from "path";
import {LOGGER} from "../helper/Log4jsHelper";

/**
 * 扫描文件目录得到文件路径
 */
export default class FilePathPackageScanner implements PackageScanner<string[]> {

    scan = (paths: string[]) => {

        return paths.filter((path) => {
            const isExist = fs.existsSync(path);
            if (!isExist) {
                LOGGER.debug(`not such path`, path);
            }
            return isExist;
        }).map(function (path) {
            const dirs = fs.readdirSync(path);
            return dirs.map((fileName) => {
                // const stats = fs.lstatSync(`${path}${pathModule.sep}${fileName}`);
                // if (stats.isDirectory()) {
                //     //文件夹
                //     return `${path}${pathModule.sep}${fileName}`;
                // }
                // //文件
                return `${path}${pathModule.sep}${fileName}`;
            }).filter((filepath) => {
                return filepath != null;
            }).map((filepath) => {
                const stats = fs.lstatSync(filepath);
                if (stats.isDirectory()) {
                    const fileNames = fs.readdirSync(filepath);
                    return fileNames.map((filename) => {
                        return `${filepath}${pathModule.sep}${filename}`;
                    });
                }else {
                    return [filepath];
                }

            }).flatMap((items) => [...items]);
        }).flatMap((items) => [...items]);
    };


}