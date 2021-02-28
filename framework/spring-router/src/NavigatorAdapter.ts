import {LocationDescriptorObject} from "history";


export interface NavigatorDescriptorObject extends LocationDescriptorObject {
    //查询参数
    queryParams?: {
        [k: string]: any
    };
}

/**
 * 导航器适配器
 */
export interface NavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {


    /**
     * 到某个页面
     * @param params
     */
    push: (params: T) => void | Promise<any>;


    /**
     * 重定向到某个页面
     */
    redirect: (params: T) => void | Promise<any>;

    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args) => void | Promise<any>;

    /**
     * 前进
     */
    goForward?: () => void | Promise<any>;

}
