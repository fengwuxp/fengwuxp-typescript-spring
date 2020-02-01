/**
 * 路由条件处理函数
 */
declare type RouteConditionFunction = (context: any, ...args: any[]) => boolean | string | string[];
declare type RouteConditionType = string | string[] | boolean | RouteConditionFunction;
interface RouteViewOptions {
    /**
     * pathname
     * 如果值未定义，将使用约定式路由或配置式路由
     * 约定式路由将会在编译阶段处理
     * @see https://umijs.org/zh/guide/app-structure.html#src-layouts-index-js
     */
    pathname?: string;
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
    (options?: RouteViewOptions): any;
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

export { RouteConditionFunction, RouteConditionType, RouteView, RouteViewEnhancer, RouteViewType };
