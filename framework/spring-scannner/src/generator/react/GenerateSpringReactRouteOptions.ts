import {ConditionType} from "fengwuxp-spring-context/lib/condition/ConditionType";

/**
 * 用于生成 spring react route options
 */

export interface GenerateSpringReactRouteOptions {

    component: string;

    pathname: string;

    exact: boolean;

    strict: boolean;

    condition: ConditionType;

    // prop的泛型
    propsType?: Record<"name"/*名称*/, string/*导入路径*/>;
    // 生成的路由方法名称
    routeMethodName?:string;

    routes?: GenerateSpringReactRouteOptions[];

    /**
     * 是否为nodeModules的模块
     */
    isNodeModules: boolean;

    parent?: {
        importName: string,
        importPath: string
    }
}
