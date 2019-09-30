



/**
 * http request response
 */
export interface HttpResponse<T = any> {

    /**
     * http status code
     */
    status: number;

    /**
     * http status text
     */
    statusText?: string;

    /**
     * request is success
     */
    ok: boolean;


    /**
     * response data
     */
    data: T;


    /**
     * http response headers
     */
    headers?: HeadersInit | object;


}
