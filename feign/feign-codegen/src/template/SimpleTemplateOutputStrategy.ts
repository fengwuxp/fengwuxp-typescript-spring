import {TemplateOutputStrategy} from './TemplateBuildStrategy';
import * as path from "path";
import * as fs from "fs";
import {TypeDefinition} from "../model/TypeDefinition";
import {TemplateFileName} from '../enums/TemplateType';
import {LanguageDescription} from '../model/LanguageDescription';
import {OUTPUT_DIR_TAG} from '../constant/ConstantVariables';


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
        let output = SimpleTemplateOutputStrategy.TEMPLATE_OUTPUT_MAP[templateName];
        const tags = renderData.tags;
        if (tags != null) {
            const outputTag: string = tags.filter(value => {
                return value.startsWith(OUTPUT_DIR_TAG);
            })[0];
            if (outputTag != null) {
                const values = outputTag.split("@");
                output = `${output}/${values[1]}`;
            }
        }

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