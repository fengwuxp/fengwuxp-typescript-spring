import {Redirect, Route} from "react-router";
import React, {useEffect} from "react";
import {RouteContextHolder, SpelRouteConditionParser} from "fengwuxp-routing-core";
import {USER_IS_LOGIN_CONDITION} from "@/constant/RouteCondition";
import {ConditionRouteProps} from "fengwuxp-routing-react";
import {Switch} from "react-router-dom";


// const SUPPORT_MODAL_PATH = ['detail'];


let previousLocation = null;
/**
 * 默认的私有的路由，需要登录
 * @param props
 * @constructor
 */
const DefaultPrivateRoute = (props: ConditionRouteProps) => {
  const {
    path,
    exact,
    strict,
    render,
    location
  } = props;
  const isModal = (previousLocation == null || previousLocation === location) ? false : location.pathname.endsWith('/detail');
  useEffect(() => {
    previousLocation = location;
  });
  const renderFn = (routeProps, isModal) => {
    const isOk = SpelRouteConditionParser(USER_IS_LOGIN_CONDITION, RouteContextHolder.getRouteContext(), routeProps);
    const pathname = location.pathname;
    const isLoginView = pathname === "/user/login";
    routeProps.__userModalModel__ = isModal;
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

  };
  return (

    <>
      <Switch location={isModal ? previousLocation : location}>
        <Route path={path}
               exact={exact}
               strict={strict}
               render={(routeProps) => renderFn(routeProps, false)}/>
      </Switch>
      {
        isModal && <Route path={path}
                          exact={exact}
                          strict={strict}
                          render={(routeProps) => renderFn(routeProps, true)}/>
      }
    </>
  );
};


export default DefaultPrivateRoute;
