import {HttpRequest, NoneNetworkFailBack} from "..";
import {MOCK_NETWORK_FAILURE_RESPONSE} from "./NoneNetworkFailBack";
import FeignUIToastHolder from "../ui/FeignUIToast";

/**
 * default network fail back
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
export default class DefaultNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {

    private onNetworkCloseMessage: string;

    constructor(onNetworkCloseMessage?: string) {
        this.onNetworkCloseMessage = onNetworkCloseMessage || "网络不可用";
    }

    onNetworkActive = () => {

    };

    onNetworkClose = <T>(request: T) => {
        FeignUIToastHolder.getFeignUIToast().toast(this.onNetworkCloseMessage);
        return Promise.reject(MOCK_NETWORK_FAILURE_RESPONSE);
    };


}

