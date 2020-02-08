import FilePathScanningCandidateProgramProvider
    from "fengwuxp-spring-context/esnext/annotation/FilePathScanningCandidateProgramProvider";
import DefaultExportTypeFilter from "fengwuxp-spring-core/esnext/babel/type/DefaultExportTypeFilter";
import {
    CallExpression,
    ClassDeclaration,
    File, Identifier, isCallExpression, isClassDeclaration,
    isDecorator, isVariableDeclaration,
    ObjectExpression,
    TSTypeParameterInstantiation,
    TSTypeReference
} from "@babel/types";
import {findDefaultDeclarationHandlers} from "fengwuxp-spring-core/esnext/babel/find";
import {GenerateSpringReactRouteOptions} from "./GenerateSpringReactRouteOptions";
import {findImportDeclaration, findExportDefaultDeclaration} from "fengwuxp-spring-core/esnext/babel/find/FindAst";
import generator from "@babel/generator";
import * as path from "path";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import {DEFAULT_GENERATOR_OUTPUT_DIR, NODE_MODULES_DIR} from "../constant/ConstantVar";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";

const ROUTE_VIEW_DECORATOR_PATH = "fengwuxp-routing-core";
const ROUTE_VIEW_DECORATOR_NAME = "RouteView";

const ROUTE_VIEW_DECORATOR_INFO = {
    packageName: ROUTE_VIEW_DECORATOR_PATH,
    moduleName: ROUTE_VIEW_DECORATOR_NAME
};
const ROUTE_VIEW_DECORATOR_FILTER = new DefaultExportTypeFilter(ROUTE_VIEW_DECORATOR_INFO);


/**
 * 生成 react route 路由配置
 */
export default class ReactRouteConfigGenerator {

    private filePathScanningCandidateProgramProvider: FilePathScanningCandidateProgramProvider;


    // 相对项目跟目录
    private scanPackages: string[];

    /**
     * 输出路径
     */
    private output: string;

    /**
     * 路径名称转方法名称策略
     * @param pathname
     */
    private pathnameTransformMethodNameResolver: (pathname: string) => string;

    private projectBasePath: string;


    constructor(scanPackages: string[],
                projectBasePath: string,
                output?: string,
                pathnameTransformMethodNameResolver?: (pathname: string) => string) {
        this.scanPackages = scanPackages;
        this.output = output ? path.join(projectBasePath, DEFAULT_GENERATOR_OUTPUT_DIR) : output;
        this.pathnameTransformMethodNameResolver = pathnameTransformMethodNameResolver;
        this.scanPackages = scanPackages;
        const filePathScanningCandidateProgramProvider = new FilePathScanningCandidateProgramProvider();
        filePathScanningCandidateProgramProvider.addIncludeFilter(ROUTE_VIEW_DECORATOR_FILTER);
        this.filePathScanningCandidateProgramProvider = filePathScanningCandidateProgramProvider;
    }

    public generate = () => {
        const {scanPackages, filePathScanningCandidateProgramProvider} = this;
        const files = scanPackages.map((pattern) => {
            return filePathScanningCandidateProgramProvider.findCandidateComponents(pattern);
        }).map((value) => {
            return [...value];
        }).flatMap((items) => [...items]);

        const routeOptions: GenerateSpringReactRouteOptions[] = files.map((result) => {

            return this.buildRouteConfig(result.filepath, result.file);
        });

        logger.debug("GenerateSpringReactRouteOptions length", routeOptions.length);
    };


    /**
     * 生成路由配置
     * @param filepath
     * @param file
     */
    private buildRouteConfig = (filepath: string, file: File): GenerateSpringReactRouteOptions => {

        //获取到reactView的装饰器
        const reactRouteDeclaration = this.findReactRouteDeclaration(file);

        if (isDecorator(reactRouteDeclaration)) {
            // 装饰器
            return this.getSpringRouteConfig(reactRouteDeclaration.expression as CallExpression, filepath, file);
        }

        if (isCallExpression(reactRouteDeclaration)) {
            return this.getSpringRouteConfig(reactRouteDeclaration, filepath, file);
        }

        if (isVariableDeclaration(reactRouteDeclaration)) {
            return this.getSpringRouteConfig(reactRouteDeclaration.declarations[0].init as CallExpression, filepath, file);
        }

    };


    private getSpringRouteConfig = (expression: CallExpression,
                                    filepath: string,
                                    file: File) => {

        const expressionArguments = expression.arguments;

        const springReactRouteConfig: GenerateSpringReactRouteOptions = expressionArguments.map((item: ObjectExpression) => {

            return item.properties.map((prop: any) => {
                const name = prop.key.name;
                const value = prop.value;
                const attr = {};
                //&& value.type === "ArrowFunctionExpression"
                if (name === "condition") {
                    attr[name] = generator(value).code;
                } else {
                    attr[name] = value.value;
                }

                if (name === "parent") {
                    //有父页面属性，获取父页面的导入语句
                    const importDeclaration = findImportDeclaration(file, value.name);
                    //得到导入的文件路径
                    const importPath = importDeclaration.source.value;
                    //得到文件
                    attr[name] = {
                        importName: value.name,
                        importPath: importPath
                    };
                }

                return attr as GenerateSpringReactRouteOptions;
            })
        }).flatMap((items) => [...items])
            .reduce((prev, current) => {
                return {
                    ...prev,
                    ...current
                } as GenerateSpringReactRouteOptions
            }, {} as GenerateSpringReactRouteOptions);

        const {scanPackages} = this;

        if (!StringUtils.hasText(springReactRouteConfig.pathname)) {
            //没有pathname 默认使用 文件名称+文件名 "/member/input" 然后全小写;
            const index = scanPackages
                .map((item) => {
                    return item.replace("/**", "");
                })
                .map((item) => {
                    const itemLength = item.length + 1;
                    return [
                        filepath.indexOf(`${path.sep}${item}${path.sep}`),
                        itemLength
                    ];
                }).filter(([index, itemLength], i) => {
                    //  return index > 0;
                    return index > itemLength;
                }).map(([index, itemLength]) => {
                    return index + itemLength;
                }).filter((i, index) => {
                    return index === 0;
                }).reduce((prev, current) => {
                    return prev + current;
                }, 0);

            springReactRouteConfig.pathname = this.normalizeImportPath(filepath.substring(index, filepath.lastIndexOf("."))).toLowerCase();
        }
        if (springReactRouteConfig.exact == null) {
            springReactRouteConfig.exact = true;
        }
        if (springReactRouteConfig.strict == null) {
            springReactRouteConfig.strict = true;
        }

        if (!springReactRouteConfig.pathname.startsWith("/")) {
            //不是斜杠开头
            springReactRouteConfig.pathname = `/${springReactRouteConfig.pathname}`;
        }


        let componentImportPath: string;
        let {projectBasePath, output} = this;

        const nodeModulesIndex = filepath.indexOf(NODE_MODULES_DIR);
        const isNodeModules = nodeModulesIndex > 0;
        springReactRouteConfig.isNodeModules = isNodeModules;
        if (isNodeModules) {
            //node中的模块
            componentImportPath = filepath.substring(nodeModulesIndex + NODE_MODULES_DIR.length + 1, filepath.length);
        } else {
            //计算相对路径
            // /test/example/views/member/input
            // const p1 = filepath.replace(projectBasePath, "");
            // componentImportPath = path.relative(`/${outputPath}/${outputFilename}.ts`, p1);
            componentImportPath = path.relative(`${projectBasePath}${output}/`, filepath);
        }
        componentImportPath = this.normalizeImportPath(componentImportPath);

        //移除文件扩展名称
        let lastIndexOf = componentImportPath.lastIndexOf(".");
        if (lastIndexOf > 0) {
            componentImportPath = componentImportPath.substring(0, lastIndexOf);
        }

        springReactRouteConfig.component = componentImportPath;

        // 获取组件的props 类型
        springReactRouteConfig.propsType = this.getComponentPropsType(file);
        springReactRouteConfig.routeMethodName = springReactRouteConfig.pathname;

        return springReactRouteConfig;

    };

    /**
     * @param file
     */
    private findReactRouteDeclaration = (file) => {

        return findDefaultDeclarationHandlers.reduce((prev, handle) => {
            if (prev == null) {
                return handle(file, ROUTE_VIEW_DECORATOR_INFO);
            }
            return prev;
        }, null);
    };

    /**
     * 标准化导入语句
     * @param componentImportPath
     */
    private normalizeImportPath = (componentImportPath: string) => {
        return componentImportPath.replace(/\\/g, "/");
    };

    /**
     * 获取组件上的 props 类型
     * @param file
     */
    private getComponentPropsType = (file: File): Record<"name", string> => {
        const defaultDeclaration = findExportDefaultDeclaration(file);
        if (isClassDeclaration(defaultDeclaration)) {
            const superTypeParameters: TSTypeParameterInstantiation = defaultDeclaration.superTypeParameters as TSTypeParameterInstantiation;
            if (superTypeParameters == null) {
                return null;
            }
            const params: TSTypeReference[] = superTypeParameters.params as TSTypeReference[];
            return {
                name: (params[0].typeName as Identifier).name
            };
        }

        if (isCallExpression(defaultDeclaration)) {

        }


    }

}
