import {Redirect, Route} from "react-router";
import * as React from "react";
import {SpelRouteConditionParser, RouteContextHolder} from "fengwuxp-routing-core";
import {USER_IS_LOGIN_CONDITION} from "@/constant/RouteCondition";


/**
 * 默认的私有的路由，需要登录
 * @param props
 * @constructor
 */

const DefaultPrivateRoute = (props) => {
  const {
    path,
    exact,
    strict,
    render
  } = props;
  return (
    <Route path={path}
           exact={exact}
           strict={strict}
           render={(routeProps) => {
             const isOk = SpelRouteConditionParser(USER_IS_LOGIN_CONDITION, RouteContextHolder.getRouteContext(), routeProps);
             const pathname = location.pathname;
             console.log("--is ok-->", pathname, isOk);
             const isLoginView = pathname === "/user/login";
             if (isOk) {
               if (isLoginView) {
                 return <Redirect to={{
                   pathname: `/`,
                   state: {
                     from: props.location
                   }
                 }}/>
               } else {
                 return render(routeProps);
               }
             } else {
               if (isLoginView) {
                 return render(routeProps);
               } else {
                 return <Redirect to={{
                   pathname: `/user/login`,
                   state: {
                     from: props.location
                   }
                 }}/>
               }
             }

           }}/>
  );
};


export default DefaultPrivateRoute;
