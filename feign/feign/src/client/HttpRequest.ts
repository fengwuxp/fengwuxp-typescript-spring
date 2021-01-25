import {HttpMethod} from "../constant/http/HttpMethod";


export type SupportSerializableBody = any;


type HttpRequestIdGenerator = () => string;


// 自增长的request context id序列
let REQUEST_NUM = 0;

export const getNextRequestId: HttpRequestIdGenerator = () => `${REQUEST_NUM++}`;


/**
 * 请求追踪
 */
export interface RequestTrace {
    /**
     * 单次http请求的id，用于贯穿整个http请求的过程
     * 在这个过程中可以通过该id获取到请求的上下文内容
     *
     * 可以用于追踪请求
     * {@see HttpRequestIdGenerator}
     */
    requestId?: Readonly<string>;
}

/**
 * The payload object used to make the HTTP request
 * {@see HttpAdapter}
 * {@see HttpClient}
 */
export interface HttpRequest extends RequestTrace {

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
