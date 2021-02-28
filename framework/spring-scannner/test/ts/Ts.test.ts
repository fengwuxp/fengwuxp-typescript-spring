import * as log4js from "log4js";
import typescript from "typescript";
import tsconfig from "../../tsconfig.json";
import * as fs from "fs";
import * as path from "path";
import {parse} from "@babel/parser";
import {File, isDecorator, isIdentifier} from "@babel/types";
import traverse from "@babel/traverse";
import template from "@babel/template";

const logger = log4js.getLogger();
logger.level = 'debug';


describe('spring scanner test', () => {

    process.env.NODE_ENV = "development";

    test(`test one`, () => {


        let testFile = path.resolve(__dirname, "../example/views/order/detail.tsx");
        const code = fs.readFileSync(testFile, "UTF-8");

        // const file = parse(code);
        const program = typescript.createProgram({
            rootNames: [testFile],
            options: tsconfig as any
        });

        const sourceFiles = program.getSourceFiles();

        // const preProcessedFileInfo = typescript.preProcessFile(code);


        const codeText = typescript.transpileModule(code, tsconfig as any);
        logger.debug(codeText)

    })
});