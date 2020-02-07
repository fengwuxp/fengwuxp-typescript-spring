import { RouteViewOptions } from 'fengwuxp-routing-core';
import { RouteProps, RouteComponentProps } from 'react-router';
import { ComponentType } from 'react';

declare type EventNameMapPropsNameResult<PropsType> = Partial<PropsType>;
declare type MapEventNameToPropNameFactory<PropsType, GlobalPropType> = (globalPropNames: GlobalPropType) => EventNameMapPropsNameResult<PropsType>;
interface ReactCmdDataProviderEnhancerProps<PropsType, GlobalPropType> {
    /**
     * 需要监听的全局状态事件
     * 返回结果：{
     *     propName:EVENT_NAME
     * }
     */
    propMapEventName?: MapEventNameToPropNameFactory<PropsType, GlobalPropType>;
    safeMode?: boolean;
}
declare type ReactCmdDataProviderRouteViewOptions<PropsType, GlobalProps> = RouteViewOptions & {
    cmdDataProvider?: ReactCmdDataProviderEnhancerProps<PropsType, GlobalProps>;
};
declare type GlobalEventNameType<GlobalPropType, GlobalEventType> = {
    [key in keyof GlobalPropType]: GlobalEventType[keyof GlobalEventType];
};
interface ReactCmdDataProviderEnhancerType {
    (ReactComponent: any, options: ReactCmdDataProviderRouteViewOptions<any, any>): any;
    registerGlobalEventNames: <GlobalPropType, GlobalEventTyp>(globalNames: GlobalEventNameType<GlobalPropType, GlobalEventTyp>) => ReactCmdDataProviderEnhancerType;
}
/**
 * 用于增强视图 自动监听event state
 * 自动将url 参数注入 props
 * @param ReactComponent
 * @param options
 * @constructor
 */
declare const ReactCmdDataProviderEnhancer: ReactCmdDataProviderEnhancerType;

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
 * event names
 * key: state name
 * value: event name
 */
interface GlobalEventNames {
}

export { ConditionRoute, ConditionRouteFallbackTye, ConditionRouteProps, GlobalEventNameType, GlobalEventNames, ReactCmdDataProviderEnhancer, ReactCmdDataProviderEnhancerProps, ReactCmdDataProviderEnhancerType, ReactCmdDataProviderRouteViewOptions };
