import { RouteViewOptions, RouteViewEnhancer } from 'fengwuxp-routing-core';
import React from 'react';

interface RenderPageHeaderProps {
    title?: React.ReactNode | false;
    content?: React.ReactNode;
    extraContent?: React.ReactNode;
    backIcon?: () => React.ReactNode;
}
declare type RenderPageHeaderFunction = (children: React.Component, options: AntdRouteViewOptions, viewProps: any) => React.ReactElement;
declare type RenderNoAuthorityFunction = (children: React.Component, options: AntdRouteViewOptions, viewProps: any) => React.ReactElement;
interface AntdPageHeaderEnhancerType {
    /**
     * 设置render 方法
     * @param render
     */
    setWrapperRender: (render: RenderPageHeaderFunction) => AntdPageHeaderEnhancerType;
    /**
     * 渲染无权限视图
     * @param render
     */
    setRenderNoAuthorityView: (render: RenderNoAuthorityFunction) => AntdPageHeaderEnhancerType;
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
