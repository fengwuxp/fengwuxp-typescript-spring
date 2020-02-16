import FilePathScanningCandidateProgramProvider
    from "fengwuxp-spring-context/esnext/context/annotation/FilePathScanningCandidateProgramProvider";
import DefaultExportTypeFilter from "fengwuxp-spring-core/esnext/babel/type/DefaultExportTypeFilter";
import {
    ArgumentPlaceholder,
    CallExpression, Expression,
    File,
    Identifier,
    isArrowFunctionExpression,
    isCallExpression,
    isClassDeclaration,
    isDecorator,
    isIdentifier, isStringLiteral,
    isVariableDeclaration, JSXNamespacedName,
    ObjectExpression, ObjectMethod, ObjectProperty, SpreadElement,
    TSTypeAnnotation,
    TSTypeParameterInstantiation,
    TSTypeReference
} from "@babel/types";
import {findDefaultDeclarationHandlers} from "fengwuxp-spring-core/esnext/babel/find";
import {GenerateSpringReactRouteOptions} from "./GenerateSpringReactRouteOptions";
import {
    findDefaultDeclarationByName,
    findExportDefaultDeclaration
} from "fengwuxp-spring-core/esnext/babel/find/FindAst";
import generator from "@babel/generator";
import * as path from "path";
import * as fs from "fs";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import {DEFAULT_GENERATOR_OUTPUT_DIR, NODE_MODULES_DIR} from "../constant/ConstantVar";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";
import {CodeGeneratorOptions, TemplateType} from "./CodeGeneratorOptions";
import {findImportDeclarationByModuleName} from "fengwuxp-spring-core/esnext/babel/find/FindImportDeclaration";
import {isAliasImport, normalizeAliasImportPath} from "fengwuxp-spring-core/esnext/babel/alias/ImportAliasMatch";
import ArtCodegenTemplateLoader from "fengwuxp-spring-context/esnext/codegen/template/art/ArtCodegenTemplateLoader";
import {CodegenTemplateLoader} from "fengwuxp-spring-context/esnext/codegen/template/CodegenTemplateLoader";
import {CompilerOptions} from "typescript";
import {PathMatchFilter} from "fengwuxp-spring-core/esnext/core/type/PathMatchFilter";
import {initialLowercase, toLineResolver} from "fengwuxp-declarative-command";

const ROUTE_VIEW_DECORATOR_PATH = "fengwuxp-routing-core";
const ROUTE_VIEW_DECORATOR_NAME = "RouteView";

const ROUTE_VIEW_DECORATOR_INFO = {
    packageName: ROUTE_VIEW_DECORATOR_PATH,
    moduleName: ROUTE_VIEW_DECORATOR_NAME
};
// const ROUTE_VIEW_DECORATOR_FILTER = new DefaultExportTypeFilter(ROUTE_VIEW_DECORATOR_INFO);


const projectBasePath = fs.realpathSync(process.cwd());

const DEFAULT_TEMPLATE_LIST = [
    {
        templateName: "./ReactRouterConfigCodeTemplate",
        outputFilName: "routes.ts",
        type: TemplateType.ROUTE_CONFIG
    },
    {
        templateName: "./AppRouterInterfaceTemplate",
        outputFilName: "SpringAppRouterInterface.d.ts",
        type: TemplateType.ROUTER
    },
    {
        templateName: "./AppRouterTemplate",
        outputFilName: "SpringAppRouter.ts",
        type: TemplateType.ROUTER
    }
];

export const DEFAULT_EXCLUDE = [
    "/src/pages/*.ts",
    "/src/pages/*.tsx",
    "/src/pages/*.js",
    "/src/pages/*.jsx",
    "/src/pages/*.ejs",
    "/src/pages/*.css",
    "/src/pages/*.less",
    "/src/pages/*.scss",
    "/src/pages/*.sass",
    "/src/pages/**/*.ejs",
    "/src/pages/**/*.css",
    "/src/pages/**/*.less",
    "/src/pages/**/*.sass",
    "/src/pages/**/*.scss"
];

export const DEFAULT_CODEGEN_OPTIONS: CodeGeneratorOptions = {
    projectBasePath: projectBasePath,
    outputPath: DEFAULT_GENERATOR_OUTPUT_DIR,
    templateList: DEFAULT_TEMPLATE_LIST,
    templateFileDir: path.resolve(__dirname, "../../template"),
    routeBasePath: "/",
    excludeFiles: DEFAULT_EXCLUDE
};

/**
 * 获取简单的 pathname
 * @param scanPackages
 * @param filepath
 */
export const getSimplePathname = (scanPackages: string[], filepath: string): string[] => {
    const values = filepath.split(path.sep);
    const filename = values.pop();
    const dir = values.pop();
    let pathname = filename.split(".")[0];
    const number = scanPackages.map(item => {
        const values = item.split("/");
        const s = values.pop();
        if (s !== "**") {
            return s;
        }
        return values.pop();
    }).indexOf(dir);
    if (number >= 0) {
        return [pathname]
    }
    return [dir, pathname];
};

/**
 * 使用文件目录和文件名称组成 然后全小写
 * @param scanPackages
 * @param filepath
 */
const defaultFilePathTransformStrategy = (scanPackages: string[], filepath: string) => {

    const values = getSimplePathname(scanPackages, filepath);
    if (values.length == 1) {
        return `/${values[0]}`;
    }
    let [dir, pathname] = values;
    if (pathname.endsWith("View")) {
        pathname = pathname.substr(0, pathname.length - 4);
    }
    pathname = toLineResolver(initialLowercase(pathname));
    return `/${dir}/${pathname}`.toLowerCase();
};

// 将 '/' 转换为 大写字母
const defaultPathnameTransformToMethodName = (pathname: string) => {
    const methodName = pathname.replace(/\/(\w)/g, (all, letter) => {
        return letter.toUpperCase();
    });
    return methodName.replace(methodName[0], methodName[0].toLocaleLowerCase())
};

/**
 * 生成 react route 路由配置
 */
export default class ReactRouteConfigGenerator {

    protected filePathScanningCandidateProgramProvider: FilePathScanningCandidateProgramProvider;

    protected maxRouteOrder: number = 9999999;

    // 相对项目跟目录
    protected scanPackages: string[];

    protected codeOptions: CodeGeneratorOptions;

    protected codegenTemplateLoader: CodegenTemplateLoader;


    constructor(scanPackages: string[],
                // ts config compiler options
                teConfigCompilerOptions: CompilerOptions,
                codeOptions: CodeGeneratorOptions = DEFAULT_CODEGEN_OPTIONS) {
        codeOptions.aliasBasePath = path.join(projectBasePath, teConfigCompilerOptions.baseUrl);
        codeOptions.aliasConfiguration = teConfigCompilerOptions.paths;
        this.scanPackages = scanPackages;
        this.codeOptions = codeOptions;
        const filePathScanningCandidateProgramProvider = new FilePathScanningCandidateProgramProvider();
        // filePathScanningCandidateProgramProvider.addIncludeFilter(ROUTE_VIEW_DECORATOR_FILTER);
        const excludeFiles = codeOptions.excludeFiles;
        if (!excludeFiles != null) {
            filePathScanningCandidateProgramProvider.addExcludeFilter(new PathMatchFilter(excludeFiles.map((item) => {
                return item.startsWith(projectBasePath) ? item : `${projectBasePath}${item}`;
            })))
        }

        this.filePathScanningCandidateProgramProvider = filePathScanningCandidateProgramProvider;
        this.codegenTemplateLoader = new ArtCodegenTemplateLoader(codeOptions.templateFileDir);
    }

    public generate = () => {

        const routeConfigs: GenerateSpringReactRouteOptions[] = this.getRouteConfigs();
        logger.debug("GenerateSpringReactRouteOptions length", routeConfigs.length);
        const routes: GenerateSpringReactRouteOptions[] = this.margeFatherAndSonRoutes(routeConfigs);
        this.renderTemplate(routeConfigs, routes);

    };

    /**
     * 生成模板代码
     * @param routeConfigs    原始路由列表
     * @param routes          带父子路由的列表
     */
    protected renderTemplate = (routeConfigs: GenerateSpringReactRouteOptions[],
                                routes: GenerateSpringReactRouteOptions[]) => {
        const {codegenTemplateLoader, codeOptions: {templateList, routeBasePath, outputPath}} = this;
        // 生成路由配置
        templateList.forEach((item) => {
            const isConfig = item.type === TemplateType.ROUTE_CONFIG;
            const data = isConfig ? {
                routes: this.sortByExact(routes)
            } : {
                routes: this.sortByExact(routeConfigs),
                routeBasePath
            };
            const codegenTemplate = codegenTemplateLoader.load(item.templateName);
            codegenTemplate.render(path.join(projectBasePath, outputPath, item.outputFilName), data);
        })
    };

    /**
     * 获取路由配置
     */
    protected getRouteConfigs = (): GenerateSpringReactRouteOptions[] => {
        const {scanPackages, filePathScanningCandidateProgramProvider} = this;
        return scanPackages.map((pattern) => {
            return filePathScanningCandidateProgramProvider.findCandidateComponents(pattern);
        }).map((value) => {
            return [...value];
        }).flatMap((items) => [...items])
            .map(this.buildRouteConfig)
            .filter(item => item != null);
    };

    /**
     * 合并父子路由
     * @param routeConfigs
     */
    protected margeFatherAndSonRoutes = (routeConfigs: GenerateSpringReactRouteOptions[]): GenerateSpringReactRouteOptions[] => {
        //有父页面的路由
        const hasParentRoutes = routeConfigs.filter(config => {
            return config.parent != null;
        });
        //无父页面的路由
        const routes = routeConfigs.filter(config => {
            return config.parent == null;
        });
        // 组装父子路由
        const {aliasConfiguration, projectBasePath, outputPath, aliasBasePath} = this.codeOptions;
        hasParentRoutes.forEach((subRoute) => {
            const {component, parent} = subRoute;
            let parentRoute;
            if (typeof parent === "string") {
                // 以路径形式填写的parent
                parentRoute = routes.find((route) => {
                    return route.pathname === parent;
                });
            } else {
                // 以页面形式填写的parent
                let parentImportPath = parent.importPath;
                if (subRoute.isNodeModules) {
                    const _component = component.substring(0, component.lastIndexOf("/"));
                    // 计算导入路径
                    parentImportPath = path.resolve(__dirname, `${_component}`, parentImportPath)
                        .replace(__dirname, "");
                    parentImportPath = parentImportPath.substring(1, parentImportPath.length);
                } else {
                    if (isAliasImport(parent.importPath)) {
                        //转换别名的导入
                        parentImportPath = normalizeAliasImportPath(aliasBasePath, aliasConfiguration, parent.importPath);
                    } else {
                        const _component = component.substring(0, component.lastIndexOf("/"));
                        // 计算导入路径
                        // E:/workspace/idea/github/fengwuxp-typescript-spring/framework/spring-react/spring-react/test/example/pages/index
                        parentImportPath = path.resolve(_component, parentImportPath);
                    }
                    parentImportPath = path.relative(`${projectBasePath}${outputPath}/`, parentImportPath);

                }
                parentImportPath = this.normalizeImportPath(parentImportPath);

                parentRoute = routes.find((route) => {
                    return route.component === parentImportPath;
                });

            }
            if (parentRoute == null) {
                logger.error("路由配置未找到父页面 ", subRoute)
            } else {
                parentRoute.routes = parentRoute.routes || [];
                //强制使用严格模式
                subRoute.exact = true;
                parentRoute.routes.push(subRoute);
            }
        });
        return routes;
    };

    protected sortRoute = (routes: GenerateSpringReactRouteOptions[]) => {

        return routes.sort((item1, item2) => {
            const order1 = this.getRouteOrder(item1);
            const order2 = this.getRouteOrder(item2);
            return order1 - order2;
        })
    };

    protected getRouteOrder = (route: GenerateSpringReactRouteOptions) => {
        if (route.order != null) {
            return route.order;
        }

        return this.maxRouteOrder;
    }

    /**
     * 生成路由配置
     * @param filepath
     * @param file
     */
    private buildRouteConfig = ({filepath, file}: {
        filepath: string;
        file: File;
    }): GenerateSpringReactRouteOptions => {

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

        if (isCallExpression(expression.callee)) {
            return this.getSpringRouteConfig(expression.callee, filepath, file);
        }
        const expressionArguments = expression.arguments;

        const springReactRouteConfig: GenerateSpringReactRouteOptions = expressionArguments.map((item: ObjectExpression) => {
            return item.properties.map((prop: any) => {
                const name = prop.key.name;
                const value = prop.value;
                const attr = {};
                //&& value.type === "ArrowFunctionExpression"
                if (name === "condition") {
                    attr[name] = generator(value).code;
                } else if (name === 'icon') {
                    attr[name] = generator(value).code;
                } else if (name === "parent") {
                    if (isStringLiteral(value) && StringUtils.hasText(value.value)) {
                        attr[name] = value.value;
                    }
                    if (isIdentifier(value)) {
                        //有父页面属性，获取父页面的导入语句
                        const importDeclaration = findImportDeclarationByModuleName(file, value.name);
                        //得到导入的文件路径
                        const importPath = importDeclaration.source.value;
                        //得到文件
                        attr[name] = {
                            importName: value.name,
                            importPath: importPath
                        };
                    }
                } else {
                    const val = value.value;
                    attr[name] = val == null ? '' : val;
                    this.enhancedProcessProp(attr as GenerateSpringReactRouteOptions, prop);
                }
                return attr as GenerateSpringReactRouteOptions;
            });

        }).flatMap((items) => [...items])
            .reduce((prev, current) => {
                return {
                    ...prev,
                    ...current
                } as GenerateSpringReactRouteOptions
            }, {} as GenerateSpringReactRouteOptions);


        const {codeOptions: {filenameTransformPathname}, scanPackages} = this;

        if (!StringUtils.hasText(springReactRouteConfig.pathname)) {
            //没有pathname 默认使用 文件名称+文件名 "/member/input" 然后全小写;
            const resolver = filenameTransformPathname || defaultFilePathTransformStrategy;
            springReactRouteConfig.pathname = resolver(scanPackages, filepath);
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
        let {projectBasePath, outputPath} = this.codeOptions;

        const nodeModulesIndex = filepath.indexOf(NODE_MODULES_DIR);
        const isNodeModules = nodeModulesIndex > 0;
        springReactRouteConfig.isNodeModules = isNodeModules;
        if (isNodeModules) {
            //node中的模块
            componentImportPath = filepath.substring(nodeModulesIndex + NODE_MODULES_DIR.length + 1, filepath.length);
        } else {
            //计算相对路径
            // /test/example/views/member/input
            //path.relative(`${projectBasePath}${outputPath}/g.ts`, filepath)
            const relativePath = filepath.replace(projectBasePath, "");
            componentImportPath = `..${relativePath}`;
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
        if (springReactRouteConfig.propsType == null) {
            logger.error("获取props type 失败", filepath);
        }

        const pathnameTransformMethodNameResolver = this.codeOptions.pathnameTransformMethodNameResolver || defaultPathnameTransformToMethodName;
        springReactRouteConfig.routeMethodName = pathnameTransformMethodNameResolver(springReactRouteConfig.pathname);
        if (springReactRouteConfig.name == null) {
            springReactRouteConfig.name = '';
        }


        return springReactRouteConfig;

    };


    /**
     * 增强处理prop
     * @param route
     * @param prop
     */
    protected enhancedProcessProp = (route: GenerateSpringReactRouteOptions, prop: ObjectMethod | ObjectProperty | SpreadElement): void => {


    };

    /**
     * 按照路由的严格模式排序，宽松模式排排后面
     * @param routes
     */
    protected sortByExact = (routes: GenerateSpringReactRouteOptions[]) => {
        return routes.sort((item1, item2) => {
            //sub route 强制就是按照严格模式匹配
            // if (item1.routes) {
            //     item1.routes = this.sortByExact(item1.routes);
            // }

            if (item1.exact) {
                return 0
            }
            if (item2.exact) {
                return 1
            }
            return -1;
        });
    };

    /**
     * @param file
     */
    private findReactRouteDeclaration = (file: File) => {

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
        let defaultDeclaration = findExportDefaultDeclaration(file);
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

        // 函数式组件
        if (isCallExpression(defaultDeclaration)) {

            const componentType = defaultDeclaration.arguments[0];
            if (isIdentifier(componentType)) {
                defaultDeclaration = findDefaultDeclarationByName(file, componentType.name);
            }

        }

        if (isVariableDeclaration(defaultDeclaration)) {
            const variableDeclarator = defaultDeclaration.declarations[0];
            const initNode = variableDeclarator.init;
            if (isArrowFunctionExpression(initNode)) {
                const paramNode = initNode.params[0];
                if (isIdentifier(paramNode)) {
                    let typeAnnotation = paramNode.typeAnnotation as TSTypeAnnotation;
                    let tSTypeReference = typeAnnotation.typeAnnotation as TSTypeReference;
                    if (isIdentifier(tSTypeReference.typeName)) {
                        return {
                            name: tSTypeReference.typeName.name
                        }
                    }

                }
            }
        }
    }

}
