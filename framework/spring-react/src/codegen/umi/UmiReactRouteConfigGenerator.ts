import ReactRouteConfigGenerator, {
    DEFAULT_CODEGEN_OPTIONS,
    DEFAULT_EXCLUDE,
    DEFAULT_TEMPLATE_LIST,
    getSimplePathname
} from '../ReactRouteConfigGenerator';
import ts from 'typescript';
import {TemplateType} from "../CodeGeneratorOptions";
import {GenerateSpringReactRouteOptions} from "../GenerateSpringReactRouteOptions";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";
import * as path from "path";
import {initialLowercase, toLineResolver} from "fengwuxp-declarative-command";
import {RouteLevel, UmiCodeGeneratorOptions} from "./UmiCodeGeneratorOptions";


const DEFAULT_ORDER_MAP: Record<string, number> = {
    'list': 0,
    'crate': 1,
    'input': 1,
    'edit': 2,
    'detail': 3,
    'lookup': 4,
};

const VIEW_PATH_NAMES = [
    "Create",
    "Input",
    "Edit",
    "List",
    "Detail",
    "Show",
    "Lookup",
];

/**
 * 基于uim js的管理后台约定路由命名方式
 * @param scanPackages
 * @param filepath
 */
export const umiModelFilenameTransformPathname = (scanPackages: string[], filepath: string) => {
    const values = getSimplePathname(scanPackages, filepath);
    if (values.length == 1) {
        return `/${values[0]}`;
    }
    let [dir, pathname] = values;
    if (pathname.endsWith("View")) {
        pathname = pathname.substr(0, pathname.length - 4);
    }
    const newPathname = VIEW_PATH_NAMES.find(item => {
        return pathname.indexOf(item) >= 0;
    });
    if (newPathname != null) {
        return `/${dir}/${newPathname.toLowerCase()}`.toLowerCase();
    }
    pathname = toLineResolver(initialLowercase(pathname));
    return `/${dir}/${pathname}`.toLowerCase();
};

const UMI_CODEGEN_OPTIONS: UmiCodeGeneratorOptions = {
    ...DEFAULT_CODEGEN_OPTIONS,
    templateList: DEFAULT_TEMPLATE_LIST.map((item) => {
        return {...item};
    }),
    templateFileDir: path.resolve(__dirname, "../../../template"),
    excludeFiles: [
        "/src/pages/.umi/**",
        "/src/pages/user/**",
        ...DEFAULT_EXCLUDE
    ],
    filenameTransformPathname: umiModelFilenameTransformPathname,
    routeLevel: RouteLevel.TWO
};
UMI_CODEGEN_OPTIONS.templateList[0].templateName = "./umi/UmiRouterConfigCodeTemplateLevel2";
/**
 * umijs的路由生成
 */
export default class UmiReactRouteConfigGenerator extends ReactRouteConfigGenerator {


    private orderMap: Record<string, number>;


    constructor(scanPackages: string[],
                teConfigCompilerOptions: ts.CompilerOptions,
                orderMap: Record<string, number> = DEFAULT_ORDER_MAP,
                codeOptions: UmiCodeGeneratorOptions = UMI_CODEGEN_OPTIONS) {
        super(scanPackages, teConfigCompilerOptions, codeOptions);
        this.orderMap = orderMap;
        this.setRouteLevel(codeOptions.routeLevel);
    }


    generate = () => {

        const routeConfigs: GenerateSpringReactRouteOptions[] = this.getRouteConfigs();
        logger.debug("GenerateSpringReactRouteOptions length", routeConfigs.length);
        // const routes: GenerateSpringReactRouteOptions[] = this.margeFatherAndSonRoutes(routeConfigs);

        // 按照目录相同的路由分组
        const routes = this.groupByDirName(routeConfigs);

        const {codegenTemplateLoader, codeOptions: {templateList, routeBasePath, outputPath, projectBasePath}} = this;
        // 生成路由配置
        templateList.forEach((item) => {
            const isConfig = item.type === TemplateType.ROUTE_CONFIG;
            const data = isConfig ? {
                routes
            } : {
                routes: this.sortByExact(routeConfigs),
                routeBasePath
            };
            const codegenTemplate = codegenTemplateLoader.load(item.templateName);
            const finallyOutputPath = isConfig ? "./config" : outputPath;
            codegenTemplate.render(path.join(projectBasePath, finallyOutputPath, item.outputFilName), data);
        })
    };

    setRouteLevel = (level: RouteLevel) => {
        this.codeOptions["routeLevel"] = level;
        this.codeOptions.templateList[0].templateName = `./umi/UmiRouterConfigCodeTemplateLevel${level}`;
    };

    private groupByDirName = (routes: GenerateSpringReactRouteOptions[]): Array<{
        routes: GenerateSpringReactRouteOptions[],
        name: string,
        path: string,
        redirect: string,
        icon: string
    }> => {

        const routeMap: Map<string, GenerateSpringReactRouteOptions[]> = new Map<string, GenerateSpringReactRouteOptions[]>();
        routes.forEach(item => {

            // 转换component
            let values = item.component.split("/");
            let p1 = values.pop();
            let p2 = values.pop();
            item.component = `./${p2}/${p1}`;

            const [$1, dir] = item.pathname.split("/");
            let routes = routeMap.get(dir);
            if (routes == null) {
                routes = [];
                routeMap.set(dir, routes);
            }
            routes.push(item);
        });

        const result = [];
        for (const [key, routes] of routeMap.entries()) {

            const sortRoutes = this.sortRoute(routes);
            const first = sortRoutes[0];
            let icon = first.icon;
            if (icon == null) {
                icon = "require('@ant-design/icons-svg/lib/asn/SmileOutlined').default";
            } else {
                if (!icon.startsWith("require")) {
                    icon = `'${icon}'`;
                }
            }

            result.push({
                routes: sortRoutes,
                name: first.name || '',
                path: `/${key}`,
                redirect: first.pathname,
                icon
            })
        }

        return result;
    };

    protected getRouteOrder = (route: GenerateSpringReactRouteOptions) => {
        if (route.order != null) {
            return route.order;
        }
        const pop = route.pathname.split("/").pop();
        const order = this.orderMap[pop];
        if (order != null) {
            return order;
        }

        return this.maxRouteOrder;
    }
}
