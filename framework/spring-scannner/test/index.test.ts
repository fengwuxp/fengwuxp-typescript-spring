import * as log4js from "log4js";
import * as path from "path";
import * as fs from "fs";
import fn from "../src/index";


const logger = log4js.getLogger();
logger.level = 'debug';


describe('spring scanner test', () => {

    process.env.NODE_ENV = "development";

    test(`test one`, () => {
        const yamlConfigPath = path.resolve(__dirname, "../../spring-context/test");
        logger.debug("yamlConfigPath", yamlConfigPath);
        fn(yamlConfigPath);

    })
});

