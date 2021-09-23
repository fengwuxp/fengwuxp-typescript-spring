import {HttpMethod} from "../constant/http/HttpMethod";


export type SupportSerializableBody = any;


type HttpRequestIdGenerator = () => string;


// 自增长的request context id序列
let REQUEST_NUM = 0;

export const getNextRequestId: HttpRequestIdGenerator = () => `${REQUEST_NUM++}`;


/**
 * 请求上下文
 */
export interface HttpRequestContext {

    readonly attributes: object;
}


/**
 * The payload object used to make the HTTP request
 * {@see HttpAdapter}
 * {@see HttpClient}
 */
export interface HttpRequest extends HttpRequestContext {

    /**
     * 请求url
     */
    url: string;

    /**
     * request body
     */
    body?: SupportSerializableBody;

    /**
     * http request method
     * {@see HttpMethod}
     */
    method: HttpMethod | string;


    /**
     * request headers
     */
    headers?: Record<string, string>;

    /**
     * request time out times
     * The default value needs to be provided by the implementation class that implements the HttpAdapter interface
     * {@see HttpAdapter}
     */
    timeout?: number;

}
