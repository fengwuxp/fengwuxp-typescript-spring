import * as log4js from "log4js";
import * as path from "path";
import * as fs from "fs";
import SpringPackageScanner from "../../src/scanner/SpringPackageScanner";
import {PackageScanner} from "../../src/scanner/PackageScanner";
import FilePathPackageScanner from "../../src/scanner/FilePathPackageScanner";
import {
    File
} from "@babel/types";

const logger = log4js.getLogger();
logger.level = 'debug';

describe('package scanner test', () => {


    test("file package scanner test", () => {

        const packageScanner: PackageScanner<string[]> = new FilePathPackageScanner();

        const paths = packageScanner.scan([
            path.resolve(__dirname, "../example/views/")
        ]);

        logger.debug(paths);


    });

    test("spring package scanner test", () => {
        const packageScanner: PackageScanner<Record<string, File>> = new SpringPackageScanner();

        const file = packageScanner.scan([
            path.resolve(__dirname, "../example/views/")
        ]);
        logger.debug("file length", Object.keys(file));
    });


    test("path relative", () => {
        const s = path.relative("/.spring/index.ts", "/test/example/views/member/input.ts");
        logger.debug(s);
    })
});
