import {HttpRequest} from "./HttpRequest";


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
