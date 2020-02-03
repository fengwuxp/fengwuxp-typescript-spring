import {Redirect, Route, RouteComponentProps} from "react-router";
import * as React from "react";
import {PrivateRoute, PrivateRouteFallbackTye, PrivateRouteProps} from "./PrivateRoute";


const renderNoneAuthenticationFallback = (fallback: PrivateRouteFallbackTye, props: RouteComponentProps<any>) => {

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
const DefaultPrivateRoute: PrivateRoute = (props: PrivateRouteProps) => {
    const {
        path,
        exact,
        strict,
        authenticator,
        fallback,
        extraProps
    } = props;
    return (
        <Route path={path}
               exact={exact}
               strict={strict}
               render={(routeProps) => (
                   authenticator.isAuthenticated() ? (<props.component {...routeProps} {...extraProps} />) : (
                       renderNoneAuthenticationFallback(fallback, routeProps)
                   )
               )}/>
    );
};

export default DefaultPrivateRoute;
