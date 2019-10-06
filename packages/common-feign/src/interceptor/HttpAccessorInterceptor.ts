import {HttpResponse} from "../client/HttpResponse";
import {RestOperationOptions} from "../template/RestOperationOptions";

/**
 * Used to intercept the HTTP method  when accessing
 */
export interface HttpAccessorInterceptor  {

    /**
     * 请求之后的处理，仅在请求成功时执行
     * @param {HttpResponse} response 请求结果数据
     * @param {RestOperationOptions} options 请求参数
     * @return {HttpResponse | Promise<HttpResponse>} 是否继续处理下一个Interceptor或已经处理完成
     */
    postHandle?(response: HttpResponse, options: RestOperationOptions): HttpResponse | Promise<HttpResponse> | undefined | null;

    /**
     * 请求之后的处理，仅在请求失败执行
     * @param exception
     * @param options
     */
    postHandleError?(exception: HttpResponse, options: RestOperationOptions): HttpResponse | Promise<HttpResponse> | undefined | null;

    /**
     * 请求完成后执行，不论成功或失败，一旦实现了该方法则将不会执行postHandle或postHandleError
     * @param response
     * @param options
     */
    postHandleCompleted?(response: HttpResponse, options: RestOperationOptions): HttpResponse | Promise<HttpResponse> | undefined | null;
}
