import {RouteConditionType} from "../annotations/RouteView";
import {RouteContext} from "../context/RouteContext";


/**
 * 条件路由解析
 * @param condition {@see RouteConditionType} support spel
 * @param routeContext {@see RouteContext}
 * @param args 而外的参数，例如react 组件的props
 *
 * @return
 */
export type RouteConditionParser = (condition: RouteConditionType, routeContext: RouteContext, ...args) => boolean;
