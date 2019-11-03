import {HttpMethod} from "../constant/http/HttpMethod";


export interface HttpRequest {

    /**
     * 请求url
     */
    url: string;

    /**
     * request body
     */
    body?: any;

    /**
     * http request method
     *  @see {@link /src/constant/http/HttpMethod}
     */
    method: HttpMethod | string;


    /**
     * request data
     */
    headers?: Record<string, string>;

    /**
     * request time out times
     * default: 10 * 1000 ms
     */
    timeout?: number;

}
