/**
 * 路由条件处理函数
 */
import {RouteContext} from "../context/RouteContext";

/**
 * @return true or false  or返回 boolean 的 spel 表达式
 */
export type RouteConditionFunction = (context: RouteContext, ...args) => boolean | string | string[];

export type RouteConditionType = string | string[] | boolean | RouteConditionFunction;

/**
 * 页面展示模式
 */
export enum RouteViewMode {

    /**
     * 默认
     */
    DEFAULT,

    /**
     * 弹窗形式显示
     */
    DIALOG,

    /**
     * 抽屉的形式显示
     */
    DRAWER,

    /**
     * popup 形式
     */
    POPUP

}

export interface RouteViewOptions {

    /**
     * 页面展示模式
     * 默认：{@see RouteViewMode#DEFAULT}
     */
    mode?: RouteViewMode;

    /**
     * pathname
     * 如果值未定义，将使用约定式路由或配置式路由
     * 约定式路由将会在编译阶段处理
     * @see https://umijs.org/zh/guide/app-structure.html#src-layouts-index-js
     */
    pathname?: string;

    /**
     * 父路由组件，仅为 {@link RouteViewMode#DEFAULT} 的组件才能当做父路由、子路由组件
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
     * 路由顺序 值越小 越靠前
     */
    order?: number;

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
export type RouteViewEnhancer = (target: any, options: RouteViewOptions) => any;


export interface RouteViewType {

    <T = {}>(options?: RouteViewOptions & T): any;

    /**
     * 设置默认的条件
     * @param condition
     */
    setDefaultCondition: (condition: RouteConditionType) => RouteViewType;

    /**
     * 获取默认的路由条件
     */
    getDefaultCondition: () => RouteConditionType;

    /**
     * 添加一个增强处理器
     * @param enhancer
     */
    addEnhancer: (enhancer: RouteViewEnhancer) => RouteViewType;
}

// 增强处理器列表
const ROUTE_VIEW_ENHANCERS: RouteViewEnhancer[] = [];

// 默认的路由配置
const DEFAULT_ROUTE_VIEW_OPTIONS: RouteViewOptions = {
    mode: RouteViewMode.DEFAULT,
    exact: true,
    condition: true
};

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
const RouteView: RouteViewType = <T = {}>(options?: RouteViewOptions & T): Function => {


    /**
     * decorator
     * @param  {T} target 装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     */
    return function (target: any): any {
        const newOptions = {
            ...DEFAULT_ROUTE_VIEW_OPTIONS,
            ...options
        };
        return ROUTE_VIEW_ENHANCERS.reduceRight((previousValue, currentValue) => {
            return currentValue(previousValue, newOptions);
        }, target);
    }
};

RouteView.addEnhancer = (enhancer: RouteViewEnhancer) => {
    if (ROUTE_VIEW_ENHANCERS.indexOf(enhancer) < 0) {
        ROUTE_VIEW_ENHANCERS.push(enhancer);
    }
    return RouteView;
};

RouteView.setDefaultCondition = (condition: RouteConditionType) => {
    DEFAULT_ROUTE_VIEW_OPTIONS.condition = condition;
    return RouteView;
};

RouteView.getDefaultCondition = () => DEFAULT_ROUTE_VIEW_OPTIONS.condition;

export default RouteView;
