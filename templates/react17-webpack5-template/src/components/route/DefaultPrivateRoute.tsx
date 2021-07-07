import {Redirect, Route} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {PrivateRoute, PrivateRouteProps} from "./PrivateRoute";


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
        // console.log("Redirect", routeProps);
        return <Redirect to={{
            pathname: typeof authenticator.authenticationView == "function" ? authenticator.authenticationView() : "/login",
            state: {from: props.location}
        }}/>
    }
    return <Route {...routeProps}
                  exact={routeProps.exact ?? true}
                  strict={routeProps.strict ?? true}
                  render={renderProps => {
                      return <props.component {...renderProps} {...extraProps}/>;
                  }}/>
}

export default DefaultPrivateRoute;
