import {Redirect, Route} from "react-router";
import React, {useEffect} from "react";
import {RouteContextHolder, SpelRouteConditionParser, ViewShowMode} from "fengwuxp-routing-core";
import {USER_IS_LOGIN_CONDITION} from "@/constant/RouteCondition";
import {ConditionRouteProps} from "fengwuxp-routing-react";
import {Switch} from "react-router-dom";

// 启用对话框模式的参数名称
export const ENABLED_MODAL_NAME = '__userModalModel__';

// 用缓存上一个location的信息
let previousLocation = null;

/**
 * 缓存每个页面的路由模式
 * @key    页面路径
 * @value  是否使用对话框的方式进行路由
 */
const USE_MODAL_CACHE: Map<string, boolean> = new Map();

/**
 * 判断是否为一个 对话框的视图
 * 1: 路由中是否指使用对话框模式
 * 2: state中指明使用对话框模式
 * 3: 查询参数中指明使用对话框模式
 */
const isModalRoute = (props) => {

  if (history.length <= 1) {
    // 如果是第一个页面 强制关闭
    return false;
  }
  const {route, location} = props;
  if (previousLocation == null || previousLocation === location) {
    return false;
  }

  const {query, state} = location;
  if (state != null) {
    const useModal = state[ENABLED_MODAL_NAME];
    if (useModal === true) {
      return true;
    }
    if (useModal === false) {
      return false;
    }
  }
  if (query != null && query[ENABLED_MODAL_NAME]) {
    const useModal = query[ENABLED_MODAL_NAME];
    if (useModal === true) {
      return true;
    }
    if (useModal === false) {
      return false;
    }
  }
  // 期望路由的pathname
  const pathname = location.pathname;
  let useModal = USE_MODAL_CACHE.get(pathname);
  if (useModal != null) {
    return useModal;
  }
  const targetRoute = route.routes.map((item) => {
    if (pathname.startsWith(item.path)) {
      return item.routes.map((sub) => {
        if (pathname.startsWith(sub.path)) {
          return sub.routes.find(route => route.path === pathname);
        }
        return null;
      }).find(item => item != null);
    }
    return null;
  }).find(item => item != null);
  // console.log("=====targetRoute==>", targetRoute, useModal);
  useModal = targetRoute.showMode === ViewShowMode.DIALOG;
  USE_MODAL_CACHE.set(pathname, useModal);
  return useModal;
};


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
  // console.log("=======props====>", props);
  const isModal = isModalRoute(props);
  useEffect(() => {
    previousLocation = location;
  });
  const renderFn = (routeProps, isModal) => {
    const isOk = SpelRouteConditionParser(USER_IS_LOGIN_CONDITION, RouteContextHolder.getRouteContext(), routeProps);
    const pathname = location.pathname;
    const isLoginView = pathname === "/user/login";
    routeProps[ENABLED_MODAL_NAME] = isModal;
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
