import {HttpRequest} from "fengwuxp-typescript-feign";


export interface WeexHttpRequest extends HttpRequest{

    /**
     * 请求进度
     * @param data
     */
    requestProgress?: (data: {

        /**
         * 进度
         */
        progress: number;
        /**
         * 当前状态
         * state:’1’: 请求连接中
         * opened:’2’: 返回响应头中
         * received:’3’: 正在加载返回数据
         */
        readyState: number;
        /**
         * http 响应码
         */
        httpCode: number;

        /**
         * http 响应状态（响应码）描述
         */
        statusText?: string;

        /**
         * 响应头
         */
        headers: object;
    }) => void;
}

