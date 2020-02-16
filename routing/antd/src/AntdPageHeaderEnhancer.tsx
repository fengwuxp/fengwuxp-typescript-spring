import {
    SpelRouteConditionParser,
    RouteContextHolder,
    ViewShowMode,
    RouteViewEnhancer,
    RouteViewOptions
} from "fengwuxp-routing-core";
import React from "react";


export interface RenderPageHeaderProps {

    title?: React.ReactNode | false;

    content?: React.ReactNode;

    extraContent?: React.ReactNode;

    // 返回图标
    backIcon?: () => React.ReactNode;

}

export type RenderPageHeaderFunction = (children: React.Component, options: AntdRouteViewOptions, viewProps) => React.ReactElement;
export type RenderNoAuthorityFunction = (children: React.Component, options: AntdRouteViewOptions, viewProps) => React.ReactElement;

export interface AntdPageHeaderEnhancerType {

    // (children: React.Component, options: RouteViewOptions): React.Component;


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

let NO_AUTHORITY_VIEW: RenderNoAuthorityFunction = (ReactComponent: any, options: AntdRouteViewOptions, viewProps) => <>
    <ReactComponent {...viewProps}/>
</>;


// 默认不处理
let PAGE_HEADER_RENDER: RenderPageHeaderFunction = (ReactComponent: any, options: AntdRouteViewOptions, viewProps) => <>
    <ReactComponent {...viewProps}/>
</>;


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


    return (props) => {
        const b = SpelRouteConditionParser(options.condition, {
            ...RouteContextHolder.getRouteContext(),
            ...props
        }, options);

        // if (props.showMode === ViewShowMode.DIALOG) {
        //
        //     return <Model>
        //
        //     </Model>
        // }

        return b ? PAGE_HEADER_RENDER(children, options, props) : NO_AUTHORITY_VIEW(children, options, props);
    }
};

AntdPageHeaderEnhancer.setWrapperRender = (render: RenderPageHeaderFunction) => {
    PAGE_HEADER_RENDER = render;
    return AntdPageHeaderEnhancer;
};

AntdPageHeaderEnhancer.setRenderNoAuthorityView = (render: RenderNoAuthorityFunction) => {
    NO_AUTHORITY_VIEW = render;
    return AntdPageHeaderEnhancer;
};

export default AntdPageHeaderEnhancer;
