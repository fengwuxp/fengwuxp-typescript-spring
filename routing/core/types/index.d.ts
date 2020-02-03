interface RouteContext {
    pathname: string;
    uriVariables: Record<string, any>;
    state: Record<string, any>;
}
declare type RouteContextFactory<T extends RouteContext = RouteContext> = () => T;

/**
 * @return true or false  or spel表达式
 */
declare type RouteConditionFunction = (context: RouteContext, ...args: any[]) => boolean | string | string[];
declare type RouteConditionType = string | string[] | boolean | RouteConditionFunction;
/**
 * 页面展示模式
 */
declare enum ViewShowMode {
    DEFAULT = 0,
    DIALOG = 1
}
interface RouteViewOptions {
    /**
     * 页面展示模式
     * 默认：{@see ViewShowMode#DEFAULT}
     */
    showMode?: ViewShowMode;
    /**
     * pathname
     * 如果值未定义，将使用约定式路由或配置式路由
     * 约定式路由将会在编译阶段处理
     * @see https://umijs.org/zh/guide/app-structure.html#src-layouts-index-js
     */
    pathname?: string;
    /**
     * 父路由页面
     * 如果是组件对象将会在编译阶段解析后移除
     * 默认：undefined
     */
    parent?: any;
    /**
     * 视图名称
     * 支持 spel 表达式
     */
    name?: string;
    /**
     * 是否精确匹配路径（pathname）
     * default true
     */
    exact?: boolean;
    /**
     * 进入页面的条件，例如进行登陆检查、权限检查等
     * default true
     */
    condition?: RouteConditionType;
}
/**
 * 路由视图增强处理器
 */
declare type RouteViewEnhancer = (target: any, options: RouteViewOptions) => any;
interface RouteViewType {
    <T = {}>(options?: RouteViewOptions & T): any;
    /**
     * 设置默认的条件
     * @param condition
     */
    setDefaultCondition: (condition: RouteConditionType) => RouteViewType;
    /**
     * 添加一个增强处理器
     * @param enhancer
     */
    addEnhancer: (enhancer: RouteViewEnhancer) => RouteViewType;
}
/**
 * 只能装饰在类上或以高阶函数的形式使用
 *
 * 用于标记路由视图，增强处理器处理的顺序是由右向左 {@see Array#reduceRight}
 *
 * <p>
 *     react:
 *
 *       class component:
 *
 *       @RouteView({
 *           pathname:"/demo",
 *           name:"演示"
 *       })
 *       class Demo extends React.Component<{},{}>{
 *
 *       }
 *
 *      function component:
 *
 *       const Demo=(props)=><div>xxx</div>
 *
 *       // 以高阶函数的形式使用
 *       RouteView()(Demo)
 *
 * </p>
 *
 * @param options
 * @constructor
 */
declare const RouteView: RouteViewType;

/**
 * 条件路由解析
 * @param condition {@see RouteConditionType} support spel
 * @param routeContext {@see RouteContext}
 * @param args 而外的参数，例如react 组件的props
 *
 * @return
 */
declare type RouteConditionParser = (condition: RouteConditionType, routeContext: RouteContext, ...args: any[]) => boolean;

/**
 * 基于spring expression language 的路由条件解析
 * @param condition
 * @param routeContext
 * @param args
 */
declare const spelRouteConditionParser: RouteConditionParser;

declare class RouteContextHolder {
    private static ROUTE_CONTEXT_FACTORY;
    static getRouteContext: <T extends RouteContext>() => RouteContext;
    static setRouteContextFactory: (factory: RouteContextFactory<RouteContext>) => void;
}

export { RouteConditionFunction, RouteConditionParser, RouteConditionType, RouteContext, RouteContextFactory, RouteContextHolder, RouteView, RouteViewEnhancer, RouteViewOptions, RouteViewType, spelRouteConditionParser as SpelRouteConditionParser };
