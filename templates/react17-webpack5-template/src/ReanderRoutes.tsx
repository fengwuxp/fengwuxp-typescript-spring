import {Route, Switch} from "react-router-dom";
import React, {useState} from "react";
import DefaultPrivateRoute from "@/components/route/DefaultPrivateRoute";
import {AppRouterAuthenticator, AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";
import {parse} from "querystring";
import {Helmet} from "react-helmet"

const parseQueryParameters = ({search}) => {
    return search ? parse(search.substr(1)) ?? {} : {}
}

const RouteDocumentTitleProvider = (props) => {
    const {name, renderRoute} = props;
    const [title, setTitle] = useState(name || "")
    return <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
        {renderRoute(setTitle)}
    </>
}

const renderComponent = (route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {routes, name, extraProps} = route;
    return props => {
        return <RouteDocumentTitleProvider name={name}
                                          renderRoute={(onDocumentTitleChange) => {
                                              return <route.component {...props}
                                                                      {...extraProps}
                                                                      {...parseQueryParameters(props.location)}
                                                                      onDocumentTitleChange={onDocumentTitleChange}>
                                                  {routes?.length > 0 && renderAppRoutes(routes, authenticator)}
                                              </route.component>
                                          }}/>
    };
}

const routeChildrenRoute = (route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {requiredAuthentication, routes, component, extraProps, ...routeProps} = route;
    const renderProps = {
        ...routeProps,
        render: renderComponent(route, authenticator)
    }
    return requiredAuthentication ?
        <DefaultPrivateRoute key={`dpr_` + route.key} {...renderProps} authenticator={authenticator}/> :
        <Route key={`r_` + route.key} {...renderProps}/>
}
/**
 * 渲染routes
 * @param routeConfigs
 * @param authenticator
 */
export const renderAppRoutes = (routeConfigs: AuthenticatedRouteConfig[], authenticator: AppRouterAuthenticator<any>) => {

    return <Switch>
        {routeConfigs.map((route) => {
            return routeChildrenRoute(route, authenticator)
        })}
    </Switch>
}
