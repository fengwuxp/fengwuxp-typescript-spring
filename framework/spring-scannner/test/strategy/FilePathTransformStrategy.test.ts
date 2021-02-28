import * as log4js from "log4js";
import * as path from "path";
import * as fs from "fs";
import {FilePathTransformStrategy} from "../../src/strategy/FilePathTransformStrategy";
import DefaultFilePathTransformStrategy from "../../src/strategy/DefaultFilePathTransformStrategy";
import {DEFAULT_SCANNER_OPTIONS} from "../../src";

const logger = log4js.getLogger();
logger.level = 'debug';

describe('file path transform strategy  test', () => {


    test(`test default strategy`, () => {


        const filePathTransformStrategy: FilePathTransformStrategy = new DefaultFilePathTransformStrategy();

        const paths = filePathTransformStrategy.transform({
            nodeModules: ["test_model", "simple_model"],
            scanPackages: ["views", "pages"]
        });
        logger.debug("paths", paths);

        const defaultPaths = filePathTransformStrategy.transform(DEFAULT_SCANNER_OPTIONS);
        logger.debug("defaultPaths", defaultPaths);

    });

});
