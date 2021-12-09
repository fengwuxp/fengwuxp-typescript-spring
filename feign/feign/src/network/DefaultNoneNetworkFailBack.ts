import {HttpRequest, NoneNetworkFailBack} from "..";
import {MOCK_NETWORK_FAILURE_RESPONSE} from "./NoneNetworkFailBack";

/**
 * default network fail back
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
export default class DefaultNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {

    onNetworkActive = () => {

    };

    onNetworkClose = <T>(request: T) => {
        return Promise.reject(MOCK_NETWORK_FAILURE_RESPONSE);
    };


}

