import * as log4js from "log4js";
import * as path from "path";
import * as fs from "fs";
import packageScanner from "../src/SpringScanner";
import teconfig from "../tsconfig.test.json";

const logger = log4js.getLogger();
logger.level = 'debug';


describe('spring scanner test', () => {


    test(`test one`, () => {

        // logger.debug(teconfig)

        packageScanner({
            nodeModules: [
                "test-model-1"
            ],
            projectBasePath: path.join(__dirname, "../"),
            scanPackages: ["views", "pages"],
            scanBasePath: path.resolve(__dirname, "./example"),

            aliasBasePath: path.resolve(__dirname),
            aliasConfiguration: teconfig.compilerOptions.paths,
        });
    })
});