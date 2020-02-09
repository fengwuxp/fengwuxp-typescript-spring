import {CodegenTemplateLoader} from "./CodegenTemplateLoader";
import {CodegenTemplate} from "./CodegenTemplate";
import {ResourceLoader} from 'fengwuxp-spring-core/esnext/io/ResourceLoader';
import FileSystemResourceLoader from "fengwuxp-spring-core/esnext/io/FileSystemResourceLoader";


export abstract class AbstractCodegenTemplateLoader implements CodegenTemplateLoader {


    protected resourceLoader: ResourceLoader = new FileSystemResourceLoader();

    protected templateBaseDir:string;


    constructor(templateBaseDir: string) {
        this.templateBaseDir = templateBaseDir;
    }

    abstract load: (templateFileName: string) => CodegenTemplate;


}
