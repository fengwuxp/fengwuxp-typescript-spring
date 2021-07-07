import {RouteProps} from "react-router";
import * as React from "react";
import {RouteConfig} from "react-router-config";

export interface AppRouterAuthenticator<T> {


    /**
     * 鉴权
     * @param args
     */
    authorization: (...args) => Promise<T>;

    /**
     * 是否已经鉴权
     */
    isAuthenticated: () => Promise<boolean>;

    /**
     * 获取登录页面
     */
    authenticationView?: () => string;
}

/**
 * private route props
 */
export interface PrivateRouteProps extends RouteProps {
    /**
     * 鉴权者
     */
    authenticator: AppRouterAuthenticator<any>;

    extraProps?: {
        [propName: string]: any
    };
}


/**
 * 私有路由的定义
 */
export type PrivateRoute<T = any> = React.ComponentType<T>;


export interface AuthenticatedRouteConfig extends RouteConfig {

    /**
     * 路由是否需要鉴权，默认：false
     */
    requiredAuthentication?: boolean;

    routes?: AuthenticatedRouteConfig[];
}
