import {HttpMethod} from "../constant/HttpMethod";


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
    headers?: HeadersInit;

    /**
     * request time out times
     * default: 10 * 1000 ms
     */
    timeout?: number;


    // /**
    //  * content type
    //  * default："application/x-www-form-urlencoded"
    //  * @see {@link /src/constant/http/HttpMediaType}
    //  */
    // contentType?: HttpMediaType | string;
}
