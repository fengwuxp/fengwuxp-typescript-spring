import {HttpMethod} from "../constant/http/HttpMethod";


export type SupportSerializableBody = any;

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
