import * as log4js from "log4js";
import omit from "omit.js";
import {OpenApiCodeGenerator, OpenApiConfigurer, OpenApiParser} from "./OpenApi";
import {TemplateBuildStrategy} from "./template/TemplateBuildStrategy";
import {TypeDefinition} from "./model/TypeDefinition";
import {OpenApiCodegenOptions, OutputOptions} from "./OpenApiCodegenOptions";
import DefaultSwaggerParser from "./swagger/DefaultSwaggerParser";
import HbsTemplateBuildStrategy from "./template/HbsTemplateBuildStrategy";
import {getLanguageDescription} from "./model/LanguageDescription";
import SimpleTemplateOutputStrategy from "./template/SimpleTemplateOutputStrategy";
import {swaggerConfigurer} from "./swagger/SwaggerOpenApiSupport";

const logger = log4js.getLogger("DefaultOpenApiCodeGenerator");

const OPEN_API_CONFIGURERS: Array<OpenApiConfigurer> = [
    swaggerConfigurer
]

/**
 * 默认的open api sdk生成器，支持对一个文档同时生成多种语言的sdk实现
 */
export default class DefaultOpenApiCodeGenerator implements OpenApiCodeGenerator {

    private codegenOptions: OpenApiCodegenOptions;

    constructor(codegenOptions: OpenApiCodegenOptions) {
        this.codegenOptions = codegenOptions;
        OPEN_API_CONFIGURERS.forEach(configurer => configurer());
    }

    generate = async (): Promise<void> => {
        const {codegenOptions} = this;
        const outputList = Array.isArray(codegenOptions.output) ? codegenOptions.output : [codegenOptions.output];
        return Promise.all(outputList.map(this.generateByLanguage)).then(() => {
            logger.info(`sdk生成成功，共计生成${outputList.length}份`);
        });
    }

    private generateByLanguage = async (output: OutputOptions) => {
        logger.info(`开始生成 ${output.language} 的sdk`);
        const {codegenOptions} = this;
        const openApiParser: OpenApiParser<TypeDefinition[]> = new DefaultSwaggerParser(codegenOptions.apiUrl);
        openApiParser.setOpenApiParseOptions({
            ...omit(codegenOptions, ["output"]),
            output
        });
        const languageDescription = getLanguageDescription(output.language);
        const templateBuildStrategy: TemplateBuildStrategy<TypeDefinition> = new HbsTemplateBuildStrategy(languageDescription,
            new SimpleTemplateOutputStrategy(output.output, languageDescription));

        let typeDefinitions
        try {
            typeDefinitions = await openApiParser.parse()
        } catch (e) {
            logger.error("解析open api 文档失败：", e);
            return;
        }
        let genCount = 0;
        while (genCount++ <= 5 ) {
            logger.info(`开始第${genCount}次生成`);
            typeDefinitions = typeDefinitions
                .filter(item => item != null)
                .filter(item => item.needCodegen)
                .map((typedDefinition) => {
                    const dependencies = typedDefinition.dependencies || [];
                    typedDefinition.dependencies = dependencies
                        .filter(item => item != null)
                        .filter(item => {
                            return item.needImport;
                        })
                    templateBuildStrategy.build(typedDefinition);
                    return dependencies;
                }).flatMap(items => [...items])
                .filter(item => item != null)
                .filter(item => item.needCodegen);
            if (typeDefinitions.length == 0) {
                break;
            }
        }
        logger.info(`生成 ${output.language} 的sdk成功`);
    }
}