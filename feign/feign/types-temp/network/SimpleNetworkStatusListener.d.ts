import { NoneNetworkFailBack } from "./NoneNetworkFailBack";
import { HttpRequest } from "../client/HttpRequest";
/**
 * simple network status listener
 *
 * The current request is suspended when the network status is unavailable, waiting for a while, and the request is continued after the network is restored.
 * {@field maxWaitTime}
 * {@field maxWaitLength}
 */
export default class SimpleNetworkStatusListener<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {
    /**
     * 等待队列
     */
    private waitQueue;
    /**
     * 最大的等待时长
     */
    private maxWaitTime;
    /**
     * 最大的等待队列大小
     */
    private maxWaitLength;
    /**
     * @param maxWaitTime
     * @param maxWaitLength
     */
    constructor(maxWaitTime?: number, maxWaitLength?: number);
    onNetworkActive: () => void | Promise<void>;
    onNetworkClose: (request: T) => any;
    private addWaitItem;
    /**
     * 尝试移除无效的项
     */
    private tryRemoveInvalidItem;
    private rejectHttpRequest;
}
