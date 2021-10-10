import Taro from "@tarojs/taro";

/**
 * 用于多个页面传递state数据，数据保存在内存中
 * @author wxup
 * @create 2018-10-06 13:06
 **/



//页面状态传递key
export const PAGE_VIEW_STATE = "___PAGE_VIEW_STATE___";


export interface ViewRouteState<Q = any, S = any, P = any> {

    viewParams: Q,

    viewState: S
}

/**
 * 初始化页面状态
 * @param viewInstance
 */
export const initViewState = <Q = any, S = any, P = any, T = any>(viewInstance: Taro.Component<any, any>): Promise<ViewRouteState<Q, S, P>> => {

    return transferViewState().then((viewState: S) => {

        return {
            viewParams: viewInstance.$router.params as any,
            viewState: viewState == null ? {} as any : viewState
        }
    });
};

export async function transferViewState() {

    //依赖环境实现的模块
    return Taro.getStorage({key: PAGE_VIEW_STATE})
        .then(({data}: any) => {
            if (data == null) {
                return null;
            }
            return data;
        }).catch(() => {
            return Promise.resolve(null);
        });
}

/**
 * 设置下一个页面的状态
 * @param viewState
 */
export async function setNextViewState(viewState: any) {

    if (viewState == null) {
        // 清空页面的state
        viewState = null
    }
    await Taro.setStorage({
        key: PAGE_VIEW_STATE,
        data: viewState
    });
}
