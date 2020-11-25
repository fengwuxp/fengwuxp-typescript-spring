import {TemplateBuildStrategy, TemplateOutputStrategy} from "./TemplateBuildStrategy";
import {TypeDefinition} from 'model/TypeDefinition';
import FileTemplateLoader, {TemplateLoader} from "./TemplateLoader";
import {TemplateFileName, TemplateType} from "../enums/TemplateType";
import {ClassDefinitionType} from "../enums/ClassDefinitionType";
import {LanguageDescription} from "../model/LanguageDescription";
import Mustache from "mustache";
import {isEmpty} from "fengwuxp-common-utils/lib/collection/CollectionUtils";
import * as log4js from "log4js";

const logger = log4js.getLogger("MustacheTemplateBuildStrategy");

/**
 * 生成注释的模板
 **/
const descTemplate = `
{{#desc}}
 /**
  * {{desc}}
  **/
 {{/desc}}
`

/**
 * https://github.com/janl/mustache.js
 */
export default class MustacheTemplateBuildStrategy<T extends TypeDefinition = TypeDefinition> implements TemplateBuildStrategy<T> {

    private templateLoader: TemplateLoader;

    private outputStrategy: TemplateOutputStrategy<T>;


    constructor(language: LanguageDescription,
                outputStrategy: TemplateOutputStrategy<T>,
                templateLoader: TemplateLoader = new FileTemplateLoader(TemplateType.MUSTACHE, language)) {
        this.outputStrategy = outputStrategy;
        this.templateLoader = templateLoader;
    }

    build = (data: T): void => {
        const {templateLoader, outputStrategy, getTemplateName, getComments} = this;
        const templateName = getTemplateName(data);
        const template = templateLoader.load(templateName);
        if (template == null) {
            logger.warn("未找到数据：{}对应的模板文件", data);
        }
        // let partials = {fieldDesc: descTemplate};
        let index = -1;
        const comments = getComments(data);
        const result = Mustache.render(template, data, (name) => {
            index++;
            if (name === "memberDesc") {
                // 渲染成员（成员方法或成员变量）注释
                return Mustache.render(descTemplate, {desc: comments[index]});
            }
            return "";
        });
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

    private getComments = (data: T) => {
        const {fields, methods} = data;
        if (isEmpty(methods) && !isEmpty(fields)) {
            return fields.map(field => {
                return field.desc;
            });
        }
        if (isEmpty(fields) && !isEmpty(methods)) {
            return methods.map(field => {
                return field.desc;
            });
        }
        return [];
    }

}