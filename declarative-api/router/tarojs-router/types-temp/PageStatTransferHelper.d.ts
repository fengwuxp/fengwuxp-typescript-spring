/**
 * 用于多个页面传递state数据，数据保存在内存中
 * @author wxup
 * @create 2018-10-06 13:06
 **/
export interface ViewRouteState<Q = any, S = any, P = any> {
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
export declare const initViewState: <Q = any, S = any, P = any, T = any>(viewInstance: Taro.Component<any, any, any>) => Promise<ViewRouteState<Q, S, P>>;
export declare function transferViewState(): Promise<any>;
/**
 * 设置下一个页面的状态
 * @param viewState
 */
export declare function setNextViewState(viewState: any): Promise<void>;
