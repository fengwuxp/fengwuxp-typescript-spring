import { HttpRequest, NoneNetworkFailBack } from "..";
import { NotNetworkToast } from "../ui/FeignUIToast";
/**
 * default network fail back
 *
 * Prompt only when the network is unavailable and return a simulated request failure result
 */
export default class DefaultNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {
    private toast;
    constructor(toast?: NotNetworkToast);
    onNetworkActive: () => void;
    onNetworkClose: <T_1>(request: T_1) => Promise<never>;
}
