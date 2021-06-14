import {Route, Switch} from "react-router-dom";
import React from "react";
import DefaultPrivateRoute from "@/components/route/DefaultPrivateRoute";
import {AppRouterAuthenticator, AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";

const RouteWithSubRoutes = (route) => {
    return (
        <Route {...route.extraProps}
               exact={route.exact}
               strict={route.strict}
               path={route.path}
               render={props => {
                   return <route.component {...props}>
                       {route.routes && renderAppRoutes(route.routes, route.authenticator)}
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
            const {routes, requiredAuthentication, key, path, exact, strict, component} = route;
            if (routes?.length > 0) {
                return <RouteWithSubRoutes {...route} authenticator={authenticator} key={key ?? path}/>;
            }
            return requiredAuthentication ? <DefaultPrivateRoute
                    authenticator={authenticator}
                    component={component}
                    path={path}
                    exact={exact}
                    strict={strict}
                    key={key ?? path}/>
                : <Route {...route}/>
        })}
    </Switch>
}
