import {CodegenTemplate} from "./CodegenTemplate";


export interface CodegenTemplateLoader {


    load: (templateFileName: string) => CodegenTemplate;
}
