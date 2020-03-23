/**
 * http request response
 *
 * Unified http response. Implementations of different platforms need to return instances of the object or subclasses of the object.
 * {@see HttpAdapter}
 */
export interface HttpResponse<T = any> {

    /**
     * http status code
     */
    statusCode: number;

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
    headers?: Record<string, string>;


}
