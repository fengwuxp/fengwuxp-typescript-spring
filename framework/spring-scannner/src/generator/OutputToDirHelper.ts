import {CodeGeneratorOptions} from "./CodeGenerator";
import {LOGGER} from "../helper/Log4jsHelper";
import * as fs from "fs";
import * as path from "path";


export const outputToDir = (code: string, options: CodeGeneratorOptions) => {
    const {projectBasePath, outputFilename, outputPath} = options;

    const fileOutputDir = path.normalize(`${projectBasePath}/${outputPath}/`);
    LOGGER.debug("fileOutputDir", fileOutputDir);
    if (!fs.existsSync(fileOutputDir)) {
        fs.mkdirSync(fileOutputDir);
    }

    fs.writeFileSync(`${fileOutputDir}/${outputFilename}`, code, {flag: "w+"});

};
