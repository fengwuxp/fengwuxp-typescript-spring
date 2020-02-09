export enum TemplateType {

    ROUTE_CONFIG,

    ROUTER
}

export interface CodeGeneratorOptions {

    //项目根路径
    projectBasePath?: string;


    /**
     * 文件的输出目录，相对与项目的src路径
     *  default .spring
     */
    outputPath?: string;

    // 模板文件根目录
    templateFileDir?: string;

    // 模板列表
    templateList?: Array<{
        templateName: string,
        type: TemplateType,
        outputFilName: string
    }>;



    // 将文件路径转换为路径
    filenameTransformPathname?: (scanPackages: string[], filename: string) => string;

    // 路径转换为路由方法名称
    pathnameTransformMethodNameResolver?: (pathname: string) => string;


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

    // 默认 /
    routeBasePath?: string;

}
