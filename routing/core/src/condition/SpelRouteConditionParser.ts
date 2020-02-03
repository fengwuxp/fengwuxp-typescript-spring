import {RouteConditionParser} from "./RouteConditionParser";
import {RouteConditionType} from "..";
import {RouteContext} from "../context/RouteContext";
import {Expression, SpelExpressionParser} from "fengwuxp-spring-expression";

const spelExpressionParser = new SpelExpressionParser();

const EXPRESSION_CACHE: Map<string, Expression> = new Map<string, Expression>();

/**
 * 基于spring expression language 的路由条件解析
 * @param condition
 * @param routeContext
 * @param args
 */
const spelRouteConditionParser: RouteConditionParser = (condition: RouteConditionType, routeContext: RouteContext, ...args) => {

    if (typeof condition === "function") {

        return spelRouteConditionParser(condition(routeContext, ...args), routeContext, ...args);
    }

    if (typeof condition === "boolean") {
        return condition;
    }
    if (Array.isArray(condition)) {
        return condition.map((item) => {
            return spelRouteConditionParser(item, routeContext, ...args);
        }).reduceRight((previousValue, currentValue) => {
            return previousValue && currentValue;
        }, true);
    }
    let expression = EXPRESSION_CACHE.get(condition);
    if (expression == null) {
        expression = spelExpressionParser.parseExpression(condition);
        EXPRESSION_CACHE.set(condition, expression);
    }
    return expression.getValue(routeContext)

};


export default spelRouteConditionParser;
