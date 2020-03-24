import {MOCK_NETWORK_FAILURE_RESPONSE, NoneNetworkFailBack} from "./NoneNetworkFailBack";
import {HttpRequest} from "../client/HttpRequest";

/**
 * simple network status listener
 *
 * The current request is suspended when the network status is unavailable, waiting for a while, and the request is continued after the network is restored.
 * {@see SimpleNoneNetworkFailBack#maxWaitTime}
 * {@see SimpleNoneNetworkFailBack#maxWaitLength}
 */
export default class SimpleNoneNetworkFailBack<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {


    /**
     * 等待队列
     */
    private waitQueue: Array<WaitHttpRequest<T>> = [];

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
    constructor(maxWaitTime?: number, maxWaitLength?: number) {
        this.maxWaitTime = maxWaitTime || 5 * 60 * 1000;
        this.maxWaitLength = maxWaitLength || 16;
    }

    onNetworkActive = (): (Promise<void> | void) => {
        this.tryRemoveInvalidItem();
        const {waitQueue} = this;
        const length = waitQueue.length;
        if (length == 0) {
            return;
        }
        console.log("等待队列的长度", length);
        let newQueue = [...waitQueue];
        //clear queue
        this.waitQueue = [];

        //retry request
        newQueue.forEach(({request, resolve}) => {
            resolve(request);
        });
        console.log("处理等待队列中的个数", newQueue.length);
        newQueue = null;
    };


    onNetworkClose = (request: T): (Promise<any> | any) => {
        this.tryRemoveInvalidItem();
        return new Promise<any>((resolve, reject) => {
            this.addWaitItem(resolve, reject, request);
        });
    };

    private addWaitItem(resolve, reject, request: T) {
        const {waitQueue, maxWaitTime, maxWaitLength} = this;
        if (waitQueue.length === maxWaitLength) {
            // 队列已满，强制移除掉第一个元素
            this.rejectHttpRequest(waitQueue.shift());
        }
        waitQueue.push({
            expireTime: new Date().getTime() + maxWaitTime,
            resolve,
            reject,
            request
        });
    }

    /**
     * 尝试移除无效的项
     */
    private tryRemoveInvalidItem = () => {
        const {waitQueue, maxWaitLength} = this;
        const oldLength = waitQueue.length;
        if (oldLength == 0) {
            return;
        }
        const currentTime = new Date().getTime();
        const newQueue = waitQueue.filter((item) => {
            // 是否还在有效期内
            const isEffective = currentTime - item.expireTime < 0;
            if (!isEffective) {
                this.rejectHttpRequest(item);
            }
            return isEffective;
        });
        const newLength = newQueue.length;
        if (newLength < maxWaitLength || newLength == 0) {
            return;
        }
        // remove first item
        this.rejectHttpRequest(newQueue.shift());
    };

    private rejectHttpRequest = (item: WaitHttpRequest<T>) => {

        if (item == null) {
            return;
        }

        const {reject} = item;
        reject(MOCK_NETWORK_FAILURE_RESPONSE);
    }
}


interface WaitHttpRequest<T> {

    expireTime: number;

    resolve: (value?: any | PromiseLike<any>) => void;

    reject: (reason?: any) => void;

    request: T
}
