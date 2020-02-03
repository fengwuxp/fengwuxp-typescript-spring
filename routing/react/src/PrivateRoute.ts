import {RouteComponentProps, RouteProps} from "react-router";
import * as React from "react";


type RenderRoute = (props: RouteComponentProps<any>) => React.ComponentType<any>;

export type PrivateRouteFallbackTye = string | RenderRoute

export interface PrivateRouteAuthenticator {
    isAuthenticated: () => boolean;
}

/**
 * private route props
 */
export interface PrivateRouteProps extends RouteProps {


    authenticator: PrivateRouteAuthenticator;

    /**
     * 降级处理
     */
    fallback: PrivateRouteFallbackTye;

    /**
     * 额外的属性
     */
    extraProps: {};
}


/**
 * 私有路由的定义
 */
export type PrivateRoute = React.ComponentType<PrivateRouteProps>;
