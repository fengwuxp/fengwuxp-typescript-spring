import {CodeGeneratorOptions} from "../CodeGeneratorOptions";


export enum RouteLevel {

    ONE = 1,

    TWO = 2,

    THREE = 3
}

export interface UmiCodeGeneratorOptions extends CodeGeneratorOptions {

    // 路由层级 默认RouteLevel.TWO
    routeLevel?: RouteLevel

    //第一层路由的排序、名称
    oneLevelOrderMap?: Array<{ pathname: string, name: string }>
}


export interface UmiRoute {
    path?: string;
    name: string;
    title: string;
    icon: string;
    component?: string;
    routes?: any[];//GenerateSpringReactRouteOptions[] | UmiRoute[];
    redirect?: string;

    [key: string]: any;
}
