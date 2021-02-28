import {CodeGenerator, CodeGeneratorOptions} from "../CodeGenerator";
import ArtTemplateCodeGenerator from "../template/ArtTemplateCodeGenerator";
import {SpringApplicationConfiguration} from "fengwuxp-spring-context/lib/configuration/SpringApplicationConfiguration";
import {DEFAULT_GENERATOR_OUTPUT_DIR} from "../../constant/ConstantVar";
import {outputToDir} from "../OutputToDirHelper";

const artTemplateCodeGenerator = new ArtTemplateCodeGenerator();


const DEFAULT_OPTIONS: CodeGeneratorOptions = {
    outputFilename: "SpringWebApplicationConfiguration",
    outputPath: DEFAULT_GENERATOR_OUTPUT_DIR,
    projectBasePath: null
};

export default class SpringApplicationConfigurationGenerator implements CodeGenerator<void> {


    generator = (config: SpringApplicationConfiguration, options: CodeGeneratorOptions) => {

        const _options: CodeGeneratorOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        const _c: SpringApplicationConfiguration = {...config};
        delete _c.spring.scanner;
        delete _c.spring.node;
        delete _c.webpack;
        // delete _c.spring.profiles;

        const code = artTemplateCodeGenerator.generator("SpringApplicationConfiguration.art", {
            config: JSON.stringify(_c)
        });
        outputToDir(code, _options)
    };


}