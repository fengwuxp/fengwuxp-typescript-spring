import {Route, Switch} from "react-router-dom";
import React from "react";
import DefaultPrivateRoute from "@/components/route/DefaultPrivateRoute";
import {AppRouterAuthenticator, AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";

const renderComponent = (route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {routes, extraProps} = route;
    return props => {
        return <route.component {...props} {...extraProps}>
            {routes?.length > 0 && renderAppRoutes(routes, authenticator)}
        </route.component>;
    };
}

const routeChildrenRoute = (route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {requiredAuthentication, routes, component, extraProps, ...routeProps} = route;
    const renderProps = {
        ...routeProps,
        render: renderComponent(route, authenticator)
    }
    return requiredAuthentication ? <DefaultPrivateRoute {...renderProps} authenticator={authenticator}/> :
        <Route {...renderProps}/>
}
/**
 * 渲染routes
 * @param routeConfigs
 * @param authenticator
 */
export const renderAppRoutes = (routeConfigs: AuthenticatedRouteConfig[], authenticator: AppRouterAuthenticator<any>) => {

    return <Switch>
        {routeConfigs.map((route) => {
            return routeChildrenRoute(route, authenticator);
        })}
    </Switch>
}
