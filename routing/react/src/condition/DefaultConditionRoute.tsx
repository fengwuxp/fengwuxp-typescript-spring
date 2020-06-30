import {Redirect, Route, RouteComponentProps} from "react-router";
import * as React from "react";
import {ConditionRoute, ConditionRouteFallbackTye, ConditionRouteProps} from "./ConditionRoute";
import {SpelRouteConditionParser, RouteContextHolder, ViewShowMode} from "fengwuxp-routing-core";
import DialogViewRoute from "../DialogViewRoute";


const renderNoneAuthenticationFallback = (fallback: ConditionRouteFallbackTye, props: RouteComponentProps<any>) => {

    if (fallback == null) {
        return <Redirect to={{
            pathname: "/login",
            state: {
                from: props.location
            }
        }}/>
    }
    if (typeof fallback === "string") {
        return <Redirect to={{
            pathname: fallback.startsWith("/") ? fallback : `/${fallback}`,
            state: {
                from: props.location
            }
        }}/>
    }

    return fallback(props);
};

/**
 * 默认的condition的路由
 * @param props
 * @constructor
 */
const DefaultConditionRoute: ConditionRoute = (props: ConditionRouteProps) => {
    const {
        path,
        exact,
        strict,
        condition,
        fallback
    } = props;
    return (
        <Route path={path}
               exact={exact}
               strict={strict}
               render={(routeProps) => (
                   SpelRouteConditionParser(condition, RouteContextHolder.getRouteContext(), props, routeProps) ? (renderView(props, routeProps)) : (
                       renderNoneAuthenticationFallback(fallback, routeProps)
                   )
               )}/>
    );
};

const renderView = (props: ConditionRouteProps, routeProps) => {

    if (props.showMode === ViewShowMode.DIALOG) {
        // 对话框方式展示
        return <DialogViewRoute {...routeProps} {...props.extraProps}>
            <props.component {...routeProps} {...props.extraProps} />
        </DialogViewRoute>
    }
    return <props.component {...routeProps} {...props.extraProps} />
};

export default DefaultConditionRoute;
