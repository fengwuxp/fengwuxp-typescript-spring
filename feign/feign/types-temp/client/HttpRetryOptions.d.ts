import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
/**
 * http retry options
 */
export interface HttpRetryOptions {
    /**
     * number of retries
     * default：1
     */
    retries?: number;
    /**
     * how long after the request fails, retry, in milliseconds
     * default：100 ms
     */
    delay?: number;
    /**
     * max timeout times
     * default：25 * 1000 ms
     */
    maxTimeout?: number;
    /**
     * do you need to continue to try again
     * @param response
     */
    when?: (response: HttpResponse) => boolean;
    /**
     * custom retry processing
     * @param request  request data
     * @param response response data
     */
    onRetry?(request: HttpRequest, response: HttpResponse): Promise<HttpResponse>;
}
