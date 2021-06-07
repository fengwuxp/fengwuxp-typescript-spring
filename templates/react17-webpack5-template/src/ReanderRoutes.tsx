import {RouteConfig} from "react-router-config";
import {Route, Switch} from "react-router-dom";
import React from "react";
import DefaultPrivateRoute from "@/componetns/route/DefaultPrivateRoute";
import {AppRouterAuthenticator} from "@/componetns/route/PrivateRoute";

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
 * @param routes
 * @param authenticator
 */
export const renderAppRoutes = (
    routes: RouteConfig[],
    authenticator: AppRouterAuthenticator<any>) => {

    return <Switch>
        {routes.map((route, index) => {
            const {requiredAuthentication, key, path, exact, strict, component} = route;
            return requiredAuthentication ?
                <DefaultPrivateRoute
                    authenticator={authenticator}
                    component={component}
                    path={path}
                    exact={exact}
                    strict={strict}
                    key={key ?? path}/> :
                <RouteWithSubRoutes {...route} authenticator={authenticator} key={key ?? path}/>
        })}
    </Switch>
}
