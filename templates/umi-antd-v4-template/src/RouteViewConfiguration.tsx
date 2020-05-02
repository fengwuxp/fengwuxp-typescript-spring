import React, {useState} from 'react';
import {ArrowLeftOutlined} from '@ant-design/icons';
import AppRouter from '@/AppRouter';
import {AntdRouteContext} from '@/AntdRouteContext';
import {getLoginUser} from "@/SessionManager";
import {ApplicationEventType, CmdDataProvider} from 'fengwuxp-event-state';
import {USER_IS_LOGIN_CONDITION} from "@/constant/RouteCondition";
import {RouteContextHolder, RouteView} from 'fengwuxp-routing-core';
import {AntdPageHeaderEnhancer, AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {ReactCmdDataProviderEnhancer} from "fengwuxp-routing-react";
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {ANT_DESIGN_GLOBAL_EVENT_PROP_MAP, AntDesignGlobalEventNames, AntGlobalStateType} from "@/AntGlobalEventNames";
import {Modal} from "antd";
import {ENABLED_MODAL_NAME} from './DefaultPrivateRoute';

RouteContextHolder.setRouteContextFactory(() => ({
    ...AppRouter.getCurrentObject(),
    loginUser: getLoginUser(),
} as AntdRouteContext));

// console.log("==load route configuration=>");

// 注册全局事件
ReactCmdDataProviderEnhancer.registerGlobalEventNames<AntGlobalStateType, AntDesignGlobalEventNames>(ANT_DESIGN_GLOBAL_EVENT_PROP_MAP);
// 增加 cmd 处理
RouteView.addEnhancer(ReactCmdDataProviderEnhancer);
// 设置 event name 生成器
CmdDataProvider.setEventNameGenerator(() => {
    const pathname = location.pathname;
    // console.log("location.pathname", pathname);
    return `${ApplicationEventType.ROUTE}_${pathname}`;
});

AntdPageHeaderEnhancer.setWrapperRender((ReactComponent: any, options: AntdRouteViewOptions, viewProps: any) => {
    console.log('viewProps', viewProps, options);
    const pageHeader = options.pageHeader || {};
    const {location} = viewProps;
    const {state, query} = location;
    if ((state && state[ENABLED_MODAL_NAME]) || (query && Boolean(query[ENABLED_MODAL_NAME]))) {
        const [visible, setVisible] = useState(true);

        return <Modal
            title={viewProps.route.name}
            visible={true}
            width={"60%"}
            style={{marginLeft: 300}}
            onCancel={() => {
                setVisible(false);
                AppRouter.goBack();
            }}
            footer={visible}>
            <ReactComponent {...viewProps}/>
        </Modal>
    }

    const showBack = !location.pathname.endsWith('/list');

    return <>
        <PageHeaderWrapper title={pageHeader.title || viewProps.route.name}
                           content={pageHeader.content}
                           backIcon={showBack ? <ArrowLeftOutlined/> : false}
                           onBack={() => AppRouter.goBack()}>
            <ReactComponent {...viewProps}/>
        </PageHeaderWrapper>
    </>
});

// 设置无权限时的页面渲染
AntdPageHeaderEnhancer.setRenderNoAuthorityView((ReactComponent: any, options: AntdRouteViewOptions, viewProps: any) => {
    if (options.condition === USER_IS_LOGIN_CONDITION) {
        AppRouter.login();
        return null;
    }

    return <>
        <div>你没有访问该页面的权限 {options.condition}</div>
    </>
});

RouteView.addEnhancer(AntdPageHeaderEnhancer);
RouteView.setDefaultCondition(USER_IS_LOGIN_CONDITION);

