import {CodegenTemplate} from "./CodegenTemplate";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";
import * as fs from "fs";
import * as path from "path";


export abstract class AbstractCodegenTemplate implements CodegenTemplate {

    private templateFilePath: string;


    constructor(templateFilePath: string) {
        this.templateFilePath = templateFilePath;
    }

    render = (output: string, data: any) => {
        const result = this.renderTemplate(this.templateFilePath, data);
        logger.debug("template output", output);
        const values = output.split(path.sep);
        values.pop();
        // 定位输出目录
        const outDir = values.join(path.sep);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }
        fs.writeFileSync(output, result, {flag: "w+"});

    };

    protected abstract renderTemplate: (templateFilePath: string, data: any) => string

}

