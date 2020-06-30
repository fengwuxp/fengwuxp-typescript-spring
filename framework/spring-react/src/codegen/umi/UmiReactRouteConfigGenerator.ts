import ReactRouteConfigGenerator, {
    DEFAULT_CODEGEN_OPTIONS,
    DEFAULT_EXCLUDE,
    getSimplePathname
} from '../ReactRouteConfigGenerator';
import ts from 'typescript';
import {TemplateType} from "../CodeGeneratorOptions";
import {GenerateSpringReactRouteOptions} from "../GenerateSpringReactRouteOptions";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";
import * as path from "path";
import {initialLowercase, toLineResolver} from "fengwuxp-declarative-command";
import {RouteLevel, UmiCodeGeneratorOptions, UmiRoute} from "./UmiCodeGeneratorOptions";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import {isObjectExpression, isStringLiteral, ObjectProperty} from "@babel/types";
import memoize from 'lodash/memoize';

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

// 默认视图目录
const DEFAULT_VIEW_DIRS = ["views", "pages"];

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

const DEFAULT_UMI_TEMPLATE_LIST = [
    {
        templateName: "./umi/UmiRouterConfigCodeTemplateLevel3",
        outputFilName: "routes.ts",
        type: TemplateType.ROUTE_CONFIG
    },
    {
        templateName: "./AppRouterInterfaceTemplate",
        outputFilName: "SpringAppRouterInterface.d.ts",
        type: TemplateType.ROUTER
    },
    {
        templateName: "./umi/UmiAppRouterTemplate",
        outputFilName: "SpringUmiAppRouter.ts",
        type: TemplateType.ROUTER
    }
];


const UMI_CODEGEN_OPTIONS: UmiCodeGeneratorOptions = {
    ...DEFAULT_CODEGEN_OPTIONS,
    templateList: DEFAULT_UMI_TEMPLATE_LIST,
    templateFileDir: path.resolve(__dirname, "../../../template"),
    excludeFiles: [
        "/src/pages/.umi/**",
        "/src/pages/user/**",
        ...DEFAULT_EXCLUDE
    ],
    filenameTransformPathname: umiModelFilenameTransformPathname,
    routeLevel: RouteLevel.THREE
};

/**
 * umijs的路由生成
 */
export default class UmiReactRouteConfigGenerator extends ReactRouteConfigGenerator {


    // 用于排列路径在路由表中的顺序
    private orderMap: Record<string, number>;


    constructor(scanPackages: string[],
                teConfigCompilerOptions: ts.CompilerOptions,
                orderMap?: Record<string, number>,
                codeOptions?: UmiCodeGeneratorOptions) {
        super(scanPackages, teConfigCompilerOptions, {...UMI_CODEGEN_OPTIONS, ...codeOptions});
        this.orderMap = {
            ...orderMap,
            ...DEFAULT_ORDER_MAP
        };
        this.setRouteLevel(this.codeOptions["routeLevel"]);
    }


    generate = () => {

        const routeConfigs: GenerateSpringReactRouteOptions[] = this.getRouteConfigs();
        logger.debug("GenerateSpringReactRouteOptions length", routeConfigs.length);

        // 先生成AppRouter和AppRouterInterface
        const {codegenTemplateLoader, codeOptions: {templateList, routeBasePath, outputPath, projectBasePath}} = this;
        templateList.filter(item => {
            return item.type !== TemplateType.ROUTE_CONFIG;
        }).forEach((item) => {
            const data = {
                routes: this.sortByExact(routeConfigs),
                routeBasePath
            };
            const codegenTemplate = codegenTemplateLoader.load(item.templateName);
            codegenTemplate.render(path.join(projectBasePath, outputPath, item.outputFilName), data);
        });

        // hideInMenu
        routeConfigs.forEach((item) => {
            const pathname = item.pathname;
            const needHideInMenu = pathname.endsWith('detail')
                || pathname.endsWith('edit')
                || pathname.endsWith('update')
                || pathname.indexOf("/update") >= 0;
            if (needHideInMenu) {
                item['hideInMenu'] = true;
            }
        })

        // 按照目录相同的路由分组
        const routes = this.groupByDirName(routeConfigs);
        // 生成路由配置
        templateList.filter(item => {
            return item.type === TemplateType.ROUTE_CONFIG;
        }).forEach((item) => {
            const data = {
                routes
            };
            const codegenTemplate = codegenTemplateLoader.load(item.templateName);
            codegenTemplate.render(path.join(projectBasePath, "./config", item.outputFilName), data);
        })
    };

    setRouteLevel = (level: RouteLevel) => {
        this.codeOptions["routeLevel"] = level;
        this.codeOptions.templateList[0].templateName = `./umi/UmiRouterConfigCodeTemplateLevel${level}`;
    };

    /**
     * 增强处理prop
     * @param route
     * @param prop
     */
    protected enhancedProcessProp = (route: GenerateSpringReactRouteOptions, prop: any) => {

        const name = prop.key.name;
        const value = prop.value;
        if (name == "pageHeader") {
            // 页面header
            if (isObjectExpression(value)) {
                value.properties.map((item: ObjectProperty) => {
                    const value = item.value;
                    if (isStringLiteral(value)) {
                        // @ts-ignore
                        route[item.key.name] = value.value;
                    }
                })
            }
        }

    };

    private groupByDirName = (routes: GenerateSpringReactRouteOptions[]): Array<{
        routes: GenerateSpringReactRouteOptions[],
        name: string,
        path: string,
        redirect: string,
        icon: string
    }> => {

        /**
         * @key    路由的第一级目录
         * @value  页面列表配置
         */
        const routeMap: Map<string, GenerateSpringReactRouteOptions[]> = new Map<string, GenerateSpringReactRouteOptions[]>();
        routes.forEach(item => {

            // 转换component
            const component = item.component;
            const spiltItem = DEFAULT_VIEW_DIRS.map(item => `/${item}/`).find(dir => component.indexOf(dir) >= 0);
            item.component = `./${component.substring(component.indexOf(spiltItem) + spiltItem.length)}`;
            const [$0, $1, $2, $3] = item.pathname.split("/");
            const dirs = [$0, $1];
            if (StringUtils.hasText($3)) {
                dirs.push($2)
            }
            const dir = dirs.join("/");
            let routeList = routeMap.get(dir);
            if (routeList == null) {
                routeList = [];
                routeMap.set(dir, routeList);
            }
            routeList.push(item);
        });

        const margeRouteMap: Map<string, UmiRoute> = new Map<string, UmiRoute>();
        // 合并前缀相同的路由
        routeMap.forEach((routes, key) => {
            const keys = key.split("/").filter(k => StringUtils.hasText(k));
            if (keys.length === 1) {
                // 目录没有子目录
                const umiRoute = this.getUmiRoute(key, routes);
                margeRouteMap.set(key, {
                    redirect: umiRoute.redirect,
                    name: umiRoute.name,
                    path: this.fixPathPrefix(umiRoute.path),
                    title: umiRoute.title,
                    icon: this.getIcon(null),
                    routes: [
                        umiRoute
                    ]
                });
                return
            }
            // 目录存在子目录
            const [prefix, $1] = keys;
            let val = margeRouteMap.get(prefix);
            const umiRoute = this.getUmiRoute(`${prefix}/${$1}`, routes);
            if (val == null) {
                val = {
                    redirect: prefix,
                    name: prefix,
                    path: this.fixPathPrefix(prefix),
                    title: prefix,
                    icon: this.getIcon(null),
                    routes: []
                };
                margeRouteMap.set(prefix, val);
            }
            val.routes.push(umiRoute)
        });


        const result = [];
        for (const [key, routes] of margeRouteMap.entries()) {
            result.push(this.getUmiRoute(key, routes))
        }

        const {oneLevelOrderMap} = this.codeOptions as UmiCodeGeneratorOptions;
        if (oneLevelOrderMap == null) {
            return result;
        }
        const findRouteOrder = memoize((route) => {
            let index = oneLevelOrderMap.findIndex((item) => {
                const isEq = item.pathname === route.path;
                if (isEq) {
                    route.name = item.name
                }
                return isEq
            });
            if (index < 0) {
                // 如果未参与排序，则排在后面
                index = 999999;
            }
            return index;
        }, (route) => {
            return route;
        });

        return result.sort((route1, route2) => {
            return findRouteOrder(route1) - findRouteOrder(route2);
        });
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
    };

    private getUmiRoute = (key, routes) => {

        if (!Array.isArray(routes)) {
            return routes;
        }

        const sortRoutes = this.sortRoute(routes);
        const first = sortRoutes[0];
        const icon = this.getIcon(first.icon);
        sortRoutes.forEach(item => {
            item.name = this.getRouteName(item) || '';
        });

        // 如果下级菜单都需要隐藏，隐藏整个二级菜单
        const hideInMenu = sortRoutes.filter((item: any) => {
            return item.hideInMenu != true;
        }).length === 0 || undefined;

        return {
            routes: sortRoutes,
            name: this.getRouteName(first) || '',
            title: first.title || '',
            path: this.fixPathPrefix(key),
            redirect: first.pathname,
            icon,
            hideInMenu: hideInMenu
        };

    };


    private getIcon = (icon) => {
        if (icon == null) {
            // return "require('@ant-design/icons-svg/lib/asn/SmileOutlined').default";
            return "'smile'";
        } else {
            if (!icon.startsWith("require")) {
                return `'${icon}'`;
            }
        }
        return icon;
    };

    private getRouteName = (item: GenerateSpringReactRouteOptions): string => {
        const name = ["name", "title", "pathname"].find((key) => {
            return StringUtils.hasText(item[key])
        });
        return item[name];
    }
}
