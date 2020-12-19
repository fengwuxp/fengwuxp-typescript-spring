import * as log4js from "log4js";
import {OpenApiCodeGenerator} from "../src/OpenApi";
import DefaultOpenApiCodeGenerator from "../src/DefaultOpenApiCodeGenerator";
import {initialUpperCase, toHumpResolver} from "fengwuxp-declarative-command";
import {Language} from "../src/enums/Language";
import path from "path";
import fs from "fs";
import {OpenApiCodegenOptions} from "../src/OpenApiCodegenOptions";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test swagger api codegen", () => {
    const baseOutputDir = path.join(__dirname, "./example");
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
        genericObjectFields: [
            {
                fields: ["success", "data", "errorMessage"],
                unifiedResponse: true
            },
            {
                fields: ['total', 'querySize', 'queryPage', 'queryType', 'records'],
                dataKey: "records",
                genericName: "Pagination",
                genericDescription: "Pagination<T>"
            },
        ],
        output: [
            {
                language: Language.TYPESCRIPT,
                output: path.resolve(baseOutputDir, "typescript/src"),
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
        fs.rmdirSync(baseOutputDir, {recursive: true});
        const openApiCodeGenerator: OpenApiCodeGenerator = new DefaultOpenApiCodeGenerator(codegenOptions);
        await openApiCodeGenerator.generate();

    });
})