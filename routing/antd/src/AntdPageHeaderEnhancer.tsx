import {RouteViewEnhancer, RouteViewOptions} from "fengwuxp-routing-core";
import React from "react";


export interface RenderPageHeaderProps {

    title?: React.ReactNode | false;

    content?: React.ReactNode;

    extraContent?: React.ReactNode;

    // 返回图标
    backIcon?: () => React.ReactNode;

}

export type RenderPageHeaderFunction = (children: React.Component, pageHeaderProps: RenderPageHeaderProps) => React.Component;

export interface AntdPageHeaderEnhancerType {

    (children: React.Component, options: RouteViewOptions): React.Component;


    /**
     * 设置render 方法
     * @param render
     */
    setWrapperRender: (render: RenderPageHeaderFunction) => AntdPageHeaderEnhancerType;
}


// 默认不处理
let PAGE_HEADER_RENDER: RenderPageHeaderFunction = (children: React.Component, pageHeaderProps: RenderPageHeaderProps) => children;

export type AntdRouteViewOptions = RouteViewOptions & {
    pageHeader: RenderPageHeaderProps
};
/**
 * 用于增强页面，动态给页面加上统一的页面 header
 * @param children
 * @param options
 * @constructor
 */
const AntdPageHeaderEnhancer: RouteViewEnhancer & AntdPageHeaderEnhancerType = (children: React.Component, options: AntdRouteViewOptions) => {

    return PAGE_HEADER_RENDER(children, options.pageHeader);
};

AntdPageHeaderEnhancer.setWrapperRender = (render: RenderPageHeaderFunction) => {
    PAGE_HEADER_RENDER = render;
    return AntdPageHeaderEnhancer;
};

export default AntdPageHeaderEnhancer;
