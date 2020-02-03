import { RouteViewOptions, RouteViewEnhancer } from 'fengwuxp-routing-core';
import { RouteProps, RouteComponentProps } from 'react-router';
import { ComponentType } from 'react';

interface ReactCmdDataProviderEnhancerProps {
    globalEvents?: string[];
}
declare type ReactCmdDataProviderRouteViewOptions = RouteViewOptions & {
    cmdDataProvider?: ReactCmdDataProviderEnhancerProps;
};
/**
 * 用于增强视图 自动监听event state
 * @param ReactComponent
 * @param options
 * @constructor
 */
declare const ReactCmdDataProviderEnhancer: RouteViewEnhancer;

declare type ConditionRouteFallback = (props: RouteComponentProps<any>) => ComponentType<any>;
declare type ConditionRouteFallbackTye = string | ConditionRouteFallback;
/**
 * private route props
 */
interface ConditionRouteProps extends RouteProps, RouteViewOptions {
    /**
     * 降级处理
     * 默认： /login
     */
    fallback?: ConditionRouteFallbackTye;
    /**
     * 额外的属性
     */
    extraProps: {};
}
/**
 * condition route
 */
declare type ConditionRoute = ComponentType<ConditionRouteProps>;

/**
 * 默认的私有的路由，需要登录
 * @param props
 * @constructor
 */
declare const DefaultConditionRoute: ConditionRoute;

export { ConditionRoute, ConditionRouteFallbackTye, ConditionRouteProps, DefaultConditionRoute, ReactCmdDataProviderEnhancer, ReactCmdDataProviderEnhancerProps, ReactCmdDataProviderRouteViewOptions };
