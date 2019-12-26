import { NavigatorAdapter, NavigatorDescriptorObject, RouteUriVariable, AppCommandRouter, RouteConfirmBeforeJumping, NavigatorContextAdapter } from 'fengwuxp-declarative-router-adapter';
import { General } from '@tarojs/taro';
import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

declare class TaroNavigatorAdapter implements NavigatorAdapter {
    goBack: (num?: number, ...args: any[]) => Promise<General.CallbackResult>;
    popAndPush: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
    push: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
    toView: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
    popToTop: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
    reLaunch: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
    replace: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<General.CallbackResult>;
}

/**
 * 用于多个页面传递state数据，数据保存在内存中
 * @author wxup
 * @create 2018-10-06 13:06
 **/
interface ViewRouteState<Q = any, S = any, P = any> {
    viewParams: Q;
    viewState: S;
    /**
     * 页面预加载数据
     */
    viewPreload: P;
}
/**
 * 初始化页面状态
 * @param viewInstance
 */
declare const initViewState: <Q = any, S = any, P = any, T = any>(viewInstance: Taro.Component<any, any, any>) => Promise<ViewRouteState<Q, S, P>>;
declare function transferViewState(): Promise<any>;
/**
 * 设置下一个页面的状态
 * @param viewState
 */
declare function setNextViewState(viewState: any): Promise<void>;

/**
 *
 * @param pathPrefix              路径前缀，如果有分包可以设置为 /分包目录名称/pages/  ==>  /shop/pages/
 * @param methodNameCommandResolver
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
declare const tarojsAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(pathPrefix?: string, methodNameCommandResolver?: MethodNameCommandResolver, confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorAdapter?: NavigatorAdapter<NavigatorDescriptorObject>, navigatorContextAdapter?: NavigatorContextAdapter<NavigatorDescriptorObject>) => T;

export { TaroNavigatorAdapter, ViewRouteState, initViewState, setNextViewState, tarojsAppCommandRouterFactory, transferViewState };
