import {RouteComponentProps, RouteProps} from "react-router";
import * as React from "react";
import {RouteConditionType, RouteViewOptions} from "fengwuxp-routing-core";


type ConditionRouteFallback = (props: RouteComponentProps<any>) => React.ComponentType<any>;

export type ConditionRouteFallbackTye = string | ConditionRouteFallback


/**
 * private route props
 */
export interface ConditionRouteProps extends RouteProps, RouteViewOptions {

    // /**
    //  * 路由条件
    //  */
    // condition: RouteConditionType;

    /**
     * 降级处理
     * 默认： /login
     */
    fallback?: ConditionRouteFallbackTye;

    /**
     * 额外的属性
     */
    extraProps: {};
}


/**
 * condition route
 */
export type ConditionRoute = React.ComponentType<ConditionRouteProps>;
