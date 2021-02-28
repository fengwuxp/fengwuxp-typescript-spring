import {CodeGenerator} from "../CodeGenerator";
import template from "art-template";
import * as path from "path";
import * as fs from "fs";

//覆盖 art-template 默认的模板加载器
template.defaults.loader = (filepath: string, options) => {

    return fs.readFileSync(filepath, "utf-8");
};
template.defaults["escape"] = false;

/**
 * art template code generator
 */
export default class ArtTemplateCodeGenerator implements CodeGenerator {

    private templateBaseDir: string;


    constructor(templateBaseDir?: string) {
        this.templateBaseDir = templateBaseDir || path.join(__dirname, "../../../resources/");
    }

    generator = (templateFileName: string, data: any) => {
        return template(this.templateBaseDir + templateFileName, data);
    };


}
