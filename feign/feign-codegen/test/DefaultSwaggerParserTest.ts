import * as log4js from "log4js";
import {OpenApiParser} from "../src/OpenApi";
import {TypeDefinition} from "../src/model/TypeDefinition";
import DefaultSwaggerParser from "../src/swagger/DefaultSwaggerParser";
import "../src/swagger/SwaggerOpenApiSupport";
import {Language} from "../src/enums/Language";
import {initialUpperCase, toHumpResolver} from "fengwuxp-declarative-command";

const logger = log4js.getLogger();
logger.level = 'debug';
describe("test swagger api parser", () => {

    test("remote api swagger3 parse", async () => {
        const apiUrl = "http://39.100.124.196:47001/api/v3/api-docs"
        const openApiParser: OpenApiParser<TypeDefinition[]> = new DefaultSwaggerParser(apiUrl);
        openApiParser.setOpenApiParseOptions({
            apiUrl,
            getFeignClientName: (tageName: string, tageDesc: string, uri: string): string => {
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
            output: {
                language: Language.TYPESCRIPT
            } as any
        })
        const result = await openApiParser.parse();
        logger.debug(result);
    })
})