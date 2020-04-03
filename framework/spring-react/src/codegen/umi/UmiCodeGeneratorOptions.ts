import {CodeGeneratorOptions} from "../CodeGeneratorOptions";
import {GenerateSpringReactRouteOptions} from "../GenerateSpringReactRouteOptions";


export enum RouteLevel {

    ONE = 1,

    TWO = 2,

    THREE = 3
}

export interface UmiCodeGeneratorOptions extends CodeGeneratorOptions {

    // 路由层级 默认RouteLevel.TWO
    routeLevel?: RouteLevel
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
