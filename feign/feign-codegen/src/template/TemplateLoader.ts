import * as path from "path";
import * as  fs from "fs";
import {LanguageDescription} from "../model/LanguageDescription";

/**
 * 模板加载策略
 */
export interface TemplateLoader<T = string> {

    /**
     * 加载模板
     * @param templateFileName 模板文件名称
     */
    load: (templateFileName: string) => T
}


/**
 * 文件模板加载者
 */
export default class FileTemplateLoader implements TemplateLoader {

    /**
     * 模板文件扩展名
     * @private
     */
    private extension: string;

    /**
     * 模板所在目录
     * @private
     */
    private templateDir: string;

    /**
     * @param extension 模板文件扩展名
     * @param language  语言描述
     * @param baseDir   模板基础目录
     */
    constructor(extension: string, language: LanguageDescription, baseDir: string = path.resolve(__filename, "../../../templates")) {
        this.extension = extension;
        this.templateDir = path.resolve(baseDir, language.templateDir);
    }

    load(templateFileName: string): string {
        const {extension, templateDir} = this;
        const filepath = path.resolve(templateDir, `${templateFileName}.${extension}`);
        return fs.readFileSync(filepath, {encoding: "UTF-8"});
    }


}