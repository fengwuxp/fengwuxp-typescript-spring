import {Redirect, Route, RouteComponentProps} from "react-router";
import * as React from "react";
import {ConditionRoute, ConditionRouteFallbackTye, ConditionRouteProps} from "./ConditionRoute";
import {spelRouteConditionParser, RouteContextHolder} from "fengwuxp-routing-core";


const renderNoneAuthenticationFallback = (fallback: ConditionRouteFallbackTye, props: RouteComponentProps<any>) => {

    if (typeof fallback === "string") {
        return <Redirect to={{
            pathname: fallback == null ? "/login" : fallback.startsWith("/") ? fallback : `/${fallback}`,
            state: {
                from: props.location
            }
        }}/>
    }

    return fallback(props);
};

/**
 * 默认的私有的路由，需要登录
 * @param props
 * @constructor
 */
const DefaultPrivateRoute: ConditionRoute = (props: ConditionRouteProps) => {
    const {
        path,
        exact,
        strict,
        condition,
        fallback,
        extraProps
    } = props;
    return (
        <Route path={path}
               exact={exact}
               strict={strict}
               render={(routeProps) => (
                   spelRouteConditionParser(condition, RouteContextHolder.getRouteContext(), props) ? (
                       <props.component {...routeProps} {...extraProps} />) : (
                       renderNoneAuthenticationFallback(fallback, routeProps)
                   )
               )}/>
    );
};

export default DefaultPrivateRoute;
