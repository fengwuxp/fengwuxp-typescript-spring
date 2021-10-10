import * as fengwuxp_declarative_router_adapter from 'fengwuxp-declarative-router-adapter';
import { NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable, RouteConfirmBeforeJumping, NavigatorContextAdapter, RouterCommandConfiguration, AppCommandRouter, AbstractAppCommandRouter, AppRouterMappingConfiguration } from 'fengwuxp-declarative-router-adapter';
import Taro from '@tarojs/taro';
import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

declare class TaroNavigatorAdapter implements NavigatorAdapter {
    private customRouteMapping;
    constructor(customRouteMapping?: Record<string, string>);
    goBack: (num?: number, ...args: any[]) => Promise<Taro.General.CallbackResult>;
    popAndPush: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    push: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    toView: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    popToTop: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    reLaunch: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    replace: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    switchTab: (descriptorObject: NavigatorDescriptorObject | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<Taro.General.CallbackResult>;
    protected getPageUrl: (url: any) => any;
}

interface ViewRouteState<Q = any, S = any, P = any> {
    viewParams: Q;
    viewState: S;
}
/**
 * 初始化页面状态
 * @param viewInstance
 */
declare const initViewState: <Q = any, S = any, P = any, T = any>(viewInstance: Taro.Component<any, any>) => Promise<ViewRouteState<Q, S, P>>;
declare function transferViewState(): Promise<any>;
/**
 * 设置下一个页面的状态
 * @param viewState
 */
declare function setNextViewState(viewState: any): Promise<void>;

/**
 * 获取路由配置
 * @param methodNameCommandResolver
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
declare const getRouterCommandConfiguration: (confirmBeforeJumping?: RouteConfirmBeforeJumping, methodNameCommandResolver?: MethodNameCommandResolver, navigatorAdapter?: NavigatorAdapter, navigatorContextAdapter?: NavigatorContextAdapter) => RouterCommandConfiguration;
/**
 *
 * @param pathPrefix              路径前缀，如果有分包可以设置为 /分包目录名称/pages/  ==>  /shop/pages/
 * @param methodNameCommandResolver
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
declare const tarojsAppCommandRouterFactory: <T extends AppCommandRouter<fengwuxp_declarative_router_adapter.NavigatorDescriptorObject>, N extends NavigatorAdapter<fengwuxp_declarative_router_adapter.NavigatorDescriptorObject> = NavigatorAdapter<fengwuxp_declarative_router_adapter.NavigatorDescriptorObject>>(pathPrefix?: string, confirmBeforeJumping?: RouteConfirmBeforeJumping, methodNameCommandResolver?: MethodNameCommandResolver, navigatorAdapter?: NavigatorAdapter, navigatorContextAdapter?: NavigatorContextAdapter) => T;

/**
 * 抽象的tarojs命令路由器
 */
declare abstract class AbstractTarojsCommandRouter extends AbstractAppCommandRouter {
    constructor(configuration?: AppRouterMappingConfiguration);
}

export { AbstractTarojsCommandRouter, TaroNavigatorAdapter, ViewRouteState, getRouterCommandConfiguration, initViewState, setNextViewState, tarojsAppCommandRouterFactory, transferViewState };
