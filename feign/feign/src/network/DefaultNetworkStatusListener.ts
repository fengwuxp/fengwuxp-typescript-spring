import {HttpRequest, NoneNetworkFailBack} from "..";
import {RequestToast} from "../ui/RequestToast";
import {MOCK_NETWORK_FAILURE_RESPONSE} from "./NoneNetworkFailBack";

/**
 * default network status listener
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
export default class DefaultNetworkStatusListener<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {


    private toast: RequestToast;


    constructor(toast?: RequestToast) {
        this.toast = toast;
    }

    onNetworkActive = () => {

    };

    onNetworkClose = <T>(request: T) => {
        this.toast && this.toast();
        return Promise.reject(MOCK_NETWORK_FAILURE_RESPONSE);
    };


}

