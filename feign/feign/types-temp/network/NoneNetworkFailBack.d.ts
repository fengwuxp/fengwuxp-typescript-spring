import { HttpRequest } from "../client/HttpRequest";
import { HttpResponse } from "../client/HttpResponse";
/**
 * Downgrade processing without network
 */
export interface NoneNetworkFailBack<T extends HttpRequest = HttpRequest> {
    /**
     *  Network is closed
     * @param request
     */
    onNetworkClose: (request: T) => Promise<any> | any;
    /**
     * Network is activated
     */
    onNetworkActive: () => Promise<void> | void;
}
/**
 * You can use this value to indicate network errors in global error prompts
 * or use FeignUIToast {@see ../ui/RequestToast}  {@see ./DefaultNetworkStatusListener}
 */
export declare const MOCK_NETWORK_FAILURE_TEXT = "network fail";
/**
 * mock in network failure response
 */
export declare const MOCK_NETWORK_FAILURE_RESPONSE: HttpResponse;
