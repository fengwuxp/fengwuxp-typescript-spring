import * as log4js from "log4js";
import {findGroupStringPrefix} from "../src/util/ApiUtils";
import {OpenApiCodeGenerator, OpenApiParser} from "../src/OpenApi";
import DefaultOpenApiCodeGenerator from "../src/DefaultOpenApiCodeGenerator";
import {TypeDefinition} from "../src/model/TypeDefinition";
import DefaultSwaggerParser from "../src/swagger/DefaultSwaggerParser";
import {initialUpperCase, toHumpResolver} from "fengwuxp-declarative-command";
import {Language} from "../src/enums/Language";
import {TemplateBuildStrategy} from "../src/template/TemplateBuildStrategy";
import HbsTemplateBuildStrategy from "../src/template/HbsTemplateBuildStrategy";
import {TYPESCRIPT} from "../src/model/LanguageDescription";
import SimpleTemplateOutputStrategy from "../src/template/SimpleTemplateOutputStrategy";
import {TemplateLoader} from "../src/template/TemplateLoader";
import Handlebars from "handlebars";
import path from "path";
import fs from "fs";
import {OpenApiCodegenOptions} from "../src/OpenApiCodegenOptions";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test swagger api codegen", () => {
    const baseOutputDir = path.resolve(__dirname, "example");
    const codegenOptions: OpenApiCodegenOptions = {
        apiUrl: "http://39.100.124.196:47001/api/v3/api-docs",
        getFeignClientName(tageName: string, tageDesc: string, uri: string): string {
            let humpResolver = toHumpResolver(uri.replace("/v1/", "")
                .replace(/\//g, "_"));
            if (humpResolver.trim().length == 0) {
                humpResolver = "Default";
            }
            const className = initialUpperCase(humpResolver)
                .replace(/_/g, "") + "FeignClient";
            logger.debug(tageName, tageDesc, uri, className);
            return className;
        },
        output: [
            {
                language: Language.TYPESCRIPT,
                output: path.resolve(baseOutputDir, "typescript/scr"),
                clientNameSuffix: "FeignClient",
                clientProvider: "typescript-feign-sdk",
                computeExtraOutDir: (prefixUri: string, isClient: boolean) => {
                    console.log("==computeExtraOutDir=>", prefixUri, isClient);
                    return null;
                }
            }
        ]
    };

    test("test default codegen", async () => {
        const openApiCodeGenerator: OpenApiCodeGenerator = new DefaultOpenApiCodeGenerator(codegenOptions);
        fs.rmdirSync(baseOutputDir, {recursive: true});
        await openApiCodeGenerator.generate();
    })
})