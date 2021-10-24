import {Route, Switch} from "react-router-dom";
import React, {useEffect, useState} from "react";
import DefaultPrivateRoute from "@/components/route/DefaultPrivateRoute";
import {AppRouterAuthenticator, AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";
import {parse, ParseOptions} from "query-string";
import {Helmet} from "react-helmet"
import {DEFAULT_SITE_TITLE, GOOGLE_ANALYTICS_UA} from "@/env/EvnVariable";
import {useTranslation} from "react-i18next";
import ReactGA from "react-ga";
import {withTracker} from "@/components/route/gaWithTracker";

const QUERY_PARSE_OPTIONS: ParseOptions = {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "index"
};

const parseQueryParameters = ({search}) => {
    return search ? parse(search.substr(1), QUERY_PARSE_OPTIONS) ?? {} : {}
}

const RouteDocumentTitleProvider = (props) => {
    const {name, renderRoute} = props;
    const {t, i18n} = useTranslation()

    const getI18nTitle = () => {
        return t(name, DEFAULT_SITE_TITLE)
    }
    const [title, setTitle] = useState(getI18nTitle())
    useEffect(() => {
        const onLanguageChanged = () => {
            console.log("onLanguageChanged t[name]", name, getI18nTitle())
            setTitle(getI18nTitle());
        };
        // 监听切换语言事件，重新设置站点标题
        i18n.on("languageChanged", onLanguageChanged)
        return () => {
            i18n.off("languageChanged", onLanguageChanged)
        }
    }, [name])
    return <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
        {renderRoute(setTitle)}
    </>
}

const renderComponent = (enableTrace: boolean, route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {
    const {routes, name, extraProps} = route;
    return props => {
        return <RouteDocumentTitleProvider name={name}
                                           renderRoute={(onDocumentTitleChange) => {
                                               return <route.component {...props}
                                                                       {...extraProps}
                                                                       {...parseQueryParameters(props.location)}
                                                                       onDocumentTitleChange={onDocumentTitleChange}>
                                                   {routes?.length > 0 && renderRoutes(enableTrace, routes, authenticator)}
                                               </route.component>
                                           }}/>
    };
}

const routeChildrenRoute = (enableTrace: boolean, route: AuthenticatedRouteConfig, authenticator: AppRouterAuthenticator<any>) => {

    const {requiredAuthentication, routes, component, extraProps, ...routeProps} = route;
    const renderProps = {
        ...routeProps,
        render: renderComponent(enableTrace, route, authenticator)
    }
    const PrivateRouteComponent = enableTrace ? withTracker(DefaultPrivateRoute) : DefaultPrivateRoute
    const RouteComponent = enableTrace ? withTracker(Route) : Route
    return requiredAuthentication ?
        <PrivateRouteComponent key={`private_route_${route.key}`} {...renderProps}
                               authenticator={authenticator}/> :
        <RouteComponent key={`route_${route.key}`} {...renderProps}/>
}

const renderRoutes = (enableTrace: boolean, routeConfigs: AuthenticatedRouteConfig[], authenticator: AppRouterAuthenticator<any>) => {
    return <Switch>
        {routeConfigs.map((route) => {
            return routeChildrenRoute(enableTrace, route, authenticator)
        })}
    </Switch>;
}

/**
 * 渲染routes
 * @param routeConfigs
 * @param authenticator
 */
export const renderAppRoutes = (routeConfigs: AuthenticatedRouteConfig[], authenticator: AppRouterAuthenticator<any>) => {
    if (GOOGLE_ANALYTICS_UA) {
        // 配置则启用 google Analytics
        ReactGA.initialize(GOOGLE_ANALYTICS_UA);
        return renderRoutes(true, routeConfigs, authenticator)
    }
    return renderRoutes(false, routeConfigs, authenticator)

}
