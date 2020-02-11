import {CodeGeneratorOptions} from "../CodeGeneratorOptions";


export enum RouteLevel {

    ONE = 1,

    TWO = 2,

    THREE = 3
}

export interface UmiCodeGeneratorOptions extends CodeGeneratorOptions {

    // 路由层级 默认RouteLevel.TWO
    routeLevel?: RouteLevel
}
