import {HttpRequest, NoneNetworkFailBack} from "..";
import {NotNetworkToast} from "../ui/FeignUIToast";
import {MOCK_NETWORK_FAILURE_RESPONSE} from "./NoneNetworkFailBack";

/**
 * default network fail back
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
export default class DefaultNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {


    private toast: NotNetworkToast;


    constructor(toast?: NotNetworkToast) {
        this.toast = toast;
    }

    onNetworkActive = () => {

    };

    onNetworkClose = <T>(request: T) => {
        this.toast && this.toast();
        return Promise.reject(MOCK_NETWORK_FAILURE_RESPONSE);
    };


}

