/**
 * code generator
 */
export interface CodeGenerator<T = any> {

    generator: (...args) => T;
}

export interface CodeGeneratorOptions {

    //文件的输出目录，相对与项目的src路径
    //default .spring
    outputPath?: string;

    //输出的文件名称
    outputFilename?: string;

    //项目根路径
    projectBasePath: string;

    /**
     * 别名配置的根路径
     */
    aliasBasePath?: string;
    /**
     * 导入语句的别名配置
     */
    aliasConfiguration?: {
        [key: string]: string[];
    };
}