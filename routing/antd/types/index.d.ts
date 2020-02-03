import { RouteViewOptions, RouteViewEnhancer } from 'fengwuxp-routing-core';
import React from 'react';

interface RenderPageHeaderProps {
    title?: React.ReactNode | false;
    content?: React.ReactNode;
    extraContent?: React.ReactNode;
    backIcon?: () => React.ReactNode;
}
declare type RenderPageHeaderFunction = (children: React.Component, pageHeaderProps: RenderPageHeaderProps) => React.Component;
interface AntdPageHeaderEnhancerType {
    (children: React.Component, options: RouteViewOptions): React.Component;
    /**
     * 设置render 方法
     * @param render
     */
    setWrapperRender: (render: RenderPageHeaderFunction) => AntdPageHeaderEnhancerType;
}
declare type AntdRouteViewOptions = RouteViewOptions & {
    pageHeader: RenderPageHeaderProps;
};
/**
 * 用于增强页面，动态给页面加上统一的页面 header
 * @param children
 * @param options
 * @constructor
 */
declare const AntdPageHeaderEnhancer: RouteViewEnhancer & AntdPageHeaderEnhancerType;

export { AntdPageHeaderEnhancer, AntdPageHeaderEnhancerType, AntdRouteViewOptions, RenderPageHeaderFunction, RenderPageHeaderProps };
