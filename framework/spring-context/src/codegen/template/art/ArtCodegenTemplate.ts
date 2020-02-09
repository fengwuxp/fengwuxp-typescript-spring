import * as fs from "fs";
import template from "art-template";
import {AbstractCodegenTemplate} from "../AbstractCodegenTemplate";



export default class ArtCodegenTemplate extends AbstractCodegenTemplate {


    constructor(templateFilePath: string) {
        super(templateFilePath);
    }

    protected renderTemplate = (templateFilePath: string, data: any) => {
        return template(templateFilePath, data);
    };


}
