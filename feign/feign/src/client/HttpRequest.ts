import {HttpMethod} from "../constant/http/HttpMethod";


/**
 * The payload object used to make the HTTP request
 * {@see HttpAdapter}
 * {@see HttpClient}
 */
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
     * {@see HttpMethod}
     */
    method: HttpMethod | string;


    /**
     * request data
     */
    headers?: Record<string, string>;

    /**
     * request time out times
     * The default value needs to be provided by the implementation class that implements the HttpAdapter interface
     * {@see HttpAdapter}
     */
    timeout?: number;

}
