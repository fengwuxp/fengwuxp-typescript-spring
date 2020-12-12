import {OpenApiCodeGenerator, OpenApiParser} from "./OpenApi";
import {TemplateBuildStrategy} from "./template/TemplateBuildStrategy";
import {TypeDefinition} from "./model/TypeDefinition";
import * as log4js from "log4js";

const logger = log4js.getLogger("DefaultOpenApiCodeGenerator");


export default class DefaultOpenApiCodeGenerator implements OpenApiCodeGenerator {

    private openApiParser: OpenApiParser<TypeDefinition[]>;

    private templateBuildStrategy: TemplateBuildStrategy<TypeDefinition>

    generate = async (): Promise<void> => {
        const {openApiParser, templateBuildStrategy} = this;
        let typeDefinitions
        try {
            typeDefinitions = await openApiParser.parse()
        } catch (e) {
            logger.info("解析open api 文档失败：" + e);
        }
        while (true) {
            typeDefinitions = typeDefinitions.map((typedDefinition) => {
                templateBuildStrategy.build(typedDefinition);
                return typedDefinition.dependencies;
            }).flatMap(items => [...items]);
            if (typeDefinitions.length == 0) {
                break;
            }
        }

    }
}