import {Redirect, Route} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {PrivateRoute, PrivateRouteProps} from "./PrivateRoute";


function isFunction(val) {
    return typeof val == "function";
}

/**
 * 默认的私有的路由，需要登录
 * @param props
 * @constructor
 */
const DefaultPrivateRoute: PrivateRoute = (props: PrivateRouteProps) => {
    const {authenticator, extraProps, component, ...routeProps} = props;
    const [authenticated, setAuthenticated] = useState(null);
    useEffect(() => {
        authenticator.isAuthenticated().then(setAuthenticated);
    }, []);

    if (authenticated == null) {
        // TODO 等待登录状态
        return <div>loading</div>;
    }
    if (!authenticated) {
        return <Redirect to={{
            pathname: isFunction(authenticator.authenticationView) ? authenticator.authenticationView() : "/login",
            state: {from: props.location}
        }}/>
    }

    const routeRenderFn = (renderComponentProps) => {
        if (isFunction(routeProps.render)) {
            return routeProps.render({...renderComponentProps, ...extraProps})
        }
        return <props.component {...renderComponentProps} {...extraProps}/>;
    }
    return <Route {...routeProps}
                  exact={routeProps.exact ?? true}
                  strict={routeProps.strict ?? true}
                  render={routeRenderFn}/>
}

export default DefaultPrivateRoute;
