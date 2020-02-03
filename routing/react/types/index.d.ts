import { RouteViewOptions, RouteViewEnhancer } from 'fengwuxp-routing-core';

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

export { ReactCmdDataProviderEnhancer, ReactCmdDataProviderEnhancerProps, ReactCmdDataProviderRouteViewOptions };
