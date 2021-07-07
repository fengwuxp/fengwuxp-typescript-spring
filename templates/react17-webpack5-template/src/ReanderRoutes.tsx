import {Route, Switch} from "react-router-dom";
import React from "react";
import DefaultPrivateRoute from "@/components/route/DefaultPrivateRoute";
import {AppRouterAuthenticator, AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";

const routeChildrenRoutes = (route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {routes, component, extraProps, ...routeProps} = route;
    return (
        <Route {...routeProps}
               render={props => {
                   return <route.component {...props} {...extraProps}>
                       {routes?.length > 0 && renderAppRoutes(routes, authenticator)}
                   </route.component>;
               }}
        />
    );
}
/**
 * 渲染routes
 * @param routeConfigs
 * @param authenticator
 */
export const renderAppRoutes = (routeConfigs: AuthenticatedRouteConfig[], authenticator: AppRouterAuthenticator<any>) => {

    return <Switch>
        {routeConfigs.map((route) => {
            const {routes, requiredAuthentication, ...routeProps} = route;
            if (routes?.length > 0) {
                return routeChildrenRoutes(route, authenticator);
            }
            return requiredAuthentication ? <DefaultPrivateRoute
                    {...routeProps}
                    authenticator={authenticator}
                /> : <Route {...routeProps}/>
        })}
    </Switch>
}
