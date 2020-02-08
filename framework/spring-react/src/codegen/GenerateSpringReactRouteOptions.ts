export interface GenerateSpringReactRouteOptions {

    component: string;

    pathname: string;

    exact: boolean;

    strict: boolean;

    condition: any;

    // prop的泛型
    propsType?: Record<"name"/*名称*/, string/*导入路径*/>;

    // 生成的路由方法名称
    routeMethodName?: string;


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