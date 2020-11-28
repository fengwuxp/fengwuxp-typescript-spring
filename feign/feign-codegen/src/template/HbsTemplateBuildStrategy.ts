import {TemplateBuildStrategy, TemplateOutputStrategy} from "./TemplateBuildStrategy";
import {TypeDefinition} from 'model/TypeDefinition';
import FileTemplateLoader, {TemplateLoader} from "./TemplateLoader";
import {TemplateFileName, TemplateType} from "../enums/TemplateType";
import {ClassDefinitionType} from "../enums/ClassDefinitionType";
import {LanguageDescription, NONE} from "../model/LanguageDescription";
import Handlebars, {HelperOptions} from "handlebars";
import {isEmpty} from "fengwuxp-common-utils/lib/collection/CollectionUtils";
import * as log4js from "log4js";

const logger = log4js.getLogger("HbsTemplateBuildStrategy");


/**
 * https://github.com/handlebars-lang/handlebars.js
 */
export default class HbsTemplateBuildStrategy<T extends TypeDefinition = TypeDefinition> implements TemplateBuildStrategy<T> {

    private templateLoader: TemplateLoader;

    private outputStrategy: TemplateOutputStrategy<T>;

    private partialsGenerator: (data: T, loader: TemplateLoader) => { [name: string]: HandlebarsTemplateDelegate };

    constructor(language: LanguageDescription,
                outputStrategy: TemplateOutputStrategy<T>,
                partialsGenerator?: (data: T, loader: TemplateLoader) => { [name: string]: HandlebarsTemplateDelegate },
                templateLoader: TemplateLoader = new FileTemplateLoader(TemplateType.HBS, language)) {
        this.outputStrategy = outputStrategy;
        this.templateLoader = templateLoader;
        this.partialsGenerator = partialsGenerator;
    }

    build = (data: T): void => {
        const {templateLoader, outputStrategy, partialsGenerator, getTemplateName} = this;
        const templateName = getTemplateName(data);
        const template = templateLoader.load(templateName);
        if (template == null) {
            logger.warn("未找到数据：{}对应的模板文件", data);
        }
        const templateDelegate = Handlebars.compile(template);
        const result = templateDelegate(data, {
            partials: partialsGenerator(data, new FileTemplateLoader(TemplateType.HBS, NONE))
        })
        outputStrategy.output(data, templateName, result)
    }

    private getTemplateName = (data: T): TemplateFileName => {
        const {type, fields, methods} = data;
        if (type == ClassDefinitionType.ENUM) {
            return TemplateFileName.ENUM;
        }
        if (isEmpty(methods) && !isEmpty(fields)) {
            return TemplateFileName.DTO;
        }
        if (isEmpty(fields) && !isEmpty(methods)) {
            return TemplateFileName.FEIGN_CLIENT;
        }
        return null;
    }

}