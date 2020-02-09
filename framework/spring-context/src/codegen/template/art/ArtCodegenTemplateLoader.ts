import {AbstractCodegenTemplateLoader} from "../AbstractCodegenTemplateLoader";
import ArtCodegenTemplate from "./ArtCodegenTemplate";
import * as path from "path";
import template from "art-template";
import * as fs from "fs";

export default class ArtCodegenTemplateLoader extends AbstractCodegenTemplateLoader {

    private extName: string = ".art";

    constructor(templateBaseDir: string) {
        super(templateBaseDir);
        //覆盖 art-template 默认的模板加载器
        this.setArtTemplateOptions("loader", (filepath: string, options) => {
            return fs.readFileSync(filepath, "utf-8");
        });
        this.setArtTemplateOptions("escape", false);
    }

    load = (templateFileName: string) => {
        if (!templateFileName.endsWith(this.extName)) {
            templateFileName += this.extName;
        }
        return new ArtCodegenTemplate(path.join(this.templateBaseDir, templateFileName));
    };

    setArtTemplateOptions = (key: string, value: any) => {
        template.defaults[key] = value;
    }
}
