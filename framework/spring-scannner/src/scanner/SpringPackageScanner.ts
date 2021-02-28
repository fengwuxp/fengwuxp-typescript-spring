import {PackageScanner} from "./PackageScanner";
import * as fs from "fs";
import FilePathPackageScanner from "./FilePathPackageScanner";
import {parse} from "@babel/parser";
import {File} from "@babel/types";
import {hasReactViewDecorator} from "../helper/AstDecoratorHelper";


export default class SpringPackageScanner implements PackageScanner<Record<string, File>> {


    private filePathPackageScanner: PackageScanner<string[]> = new FilePathPackageScanner();


    /**
     *
     * @param paths  文件路径
     * @return File[]
     */
    scan = (paths: string[]) => {


        return this.filePathPackageScanner.scan(paths)
            .map((filepath) => {
                return [filepath, fs.readFileSync(filepath, "UTF-8")];
            }).map(([filepath, sourceCodeText]) => {
                return [
                    filepath,
                    parse(sourceCodeText, {
                        sourceType: "module",
                        plugins: [
                            "typescript",
                            "classProperties",
                            "decorators-legacy"
                        ]
                    })
                ];
            }).filter(([filepath, file]) => {
                return hasReactViewDecorator(file as File);
            }).reduce((prev:Record<string,File>, [filepath, file]) => {
                prev[filepath as string] = file as File;
                return prev;
            }, {});
    };


}
