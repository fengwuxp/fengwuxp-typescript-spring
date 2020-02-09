import ReactRouteConfigGenerator from '../ReactRouteConfigGenerator';
import ts from 'typescript';
import {CodeGeneratorOptions, TemplateType} from "../CodeGeneratorOptions";
import {GenerateSpringReactRouteOptions} from "../GenerateSpringReactRouteOptions";
import {logger} from "fengwuxp-spring-core/esnext/debug/Log4jsHelper";
import * as path from "path";


const DEFAULT_ORDER_MAP: Record<string, number> = {
    'list': 0,
    'crate': 1,
    'input': 1,
    'edit': 2,
    'detail': 3,
    'lookup': 4,
};

/**
 * umijs的路由生成
 */
export default class UmiReactRouteConfigGenerator extends ReactRouteConfigGenerator {

    private maxOrder: number = 9999999;
    private orderMap: Record<string, number>;


    constructor(scanPackages: string[],
                teConfigCompilerOptions: ts.CompilerOptions,
                orderMap: Record<string, number> = DEFAULT_ORDER_MAP,
                codeOptions?: CodeGeneratorOptions) {
        super(scanPackages, teConfigCompilerOptions, codeOptions);
        if (codeOptions == null || codeOptions.templateList == null) {
            this.codeOptions.templateList[0].templateName = "./umi/UmiRouterConfigCodeTemplate";
        }
        this.orderMap = orderMap;
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
            const data = item.type === TemplateType.ROUTE_CONFIG ? {
                routes
            } : {
                routes: this.sortByExact(routeConfigs),
                routeBasePath
            };
            const codegenTemplate = codegenTemplateLoader.load(item.templateName);
            codegenTemplate.render(path.join(projectBasePath, outputPath, item.outputFilName), data);
        })
    };

    private groupByDirName = (routes: GenerateSpringReactRouteOptions[]): Array<{
        routes: GenerateSpringReactRouteOptions[],
        name: string,
        path: string,
        redirect: string
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
            const first = routes[0];
            result.push({
                routes: this.sortRoute(routes),
                name: first.name || '',
                path: `/${key}`,
                redirect: first.pathname,
            })
        }

        return result;
    };

    private sortRoute = (routes: GenerateSpringReactRouteOptions[]) => {

        return routes.sort((item1, item2) => {
            const order1 = this.getRouteOrder(item1);
            const order2 = this.getRouteOrder(item2);
            return order1 - order2;
        })
    };

    private getRouteOrder = (route: GenerateSpringReactRouteOptions) => {
        if (route.order != null) {
            return route.order;
        }
        const pop = route.pathname.split("/").pop();
        const order = this.orderMap[pop];
        if (order != null) {
            return order;
        }

        return this.maxOrder;
    }
}
