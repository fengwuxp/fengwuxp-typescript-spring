import {TemplateOutputStrategy} from './TemplateBuildStrategy';
import * as path from "path";
import * as fs from "fs";
import {TypeDefinition} from "../model/TypeDefinition";
import {TemplateFileName} from '../enums/TemplateType';
import {LanguageDescription} from '../model/LanguageDescription';


export default class SimpleTemplateOutputStrategy<T extends TypeDefinition = TypeDefinition> implements TemplateOutputStrategy<T> {

    private static TEMPLATE_OUTPUT_MAP: Record<string, string> = {
        [TemplateFileName.ENUM]: "enums",
        [TemplateFileName.DTO]: "model",
        [TemplateFileName.FEIGN_CLIENT]: "clients"
    }

    /**
     * 输出的跟路径
     * @private
     */
    private outputDir: string;

    private language: LanguageDescription;


    constructor(outputDir: string, language: LanguageDescription) {
        this.outputDir = outputDir;
        this.language = language;
    }

    output = (renderData: T, templateName: string, renderResult: string): string => {
        const {outputDir, language} = this
        const output = SimpleTemplateOutputStrategy.TEMPLATE_OUTPUT_MAP[templateName];

        const outputTargetDir = path.resolve(outputDir, output);
        if (!fs.existsSync(outputTargetDir)) {
            fs.mkdirSync(outputTargetDir, {recursive: true});
        }
        const filename = `${renderData.name}.${language.extension}`;
        const filepath = path.resolve(outputTargetDir, filename);
        fs.writeFileSync(filepath, renderResult, {
            encoding: "UTF-8"
        });
        return filepath;
    }


}