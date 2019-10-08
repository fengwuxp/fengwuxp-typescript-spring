import {NoneNetworkFailBack} from "./NoneNetworkFailBack";
import {HttpRequest} from "./HttpRequest";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";


export default class SimpleNetworkStatusListener<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {


    private waitQueue: Array<WaitHttpRequest<T>> = [];

    private maxWaitTime;

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
        this.tryRemoveInvalidItem(true);
        const {waitQueue} = this;
        if (waitQueue.length == 0) {
            return;
        }
        // const httpClient = FeignConfigurationRegistry.getDefaultFeignConfiguration().getHttpClient();

        const newQueue = [...waitQueue];
        //clear queue
        this.waitQueue = [];

        //retry request
        newQueue.forEach(({request, resolve, reject}) => {
            // httpClient.send(request).then(resolve).catch(reject);
            resolve(request);
        });

    };


    onNetworkClose = (request: T): (Promise<any> | any) => {
        this.tryRemoveInvalidItem();
        return new Promise<any>((resolve, reject) => {
            this.addWaitItem(resolve, reject, request);
        });
    };

    private addWaitItem(resolve, reject, request: T) {
        const {waitQueue, maxWaitTime} = this;
        waitQueue.push({
            expireTime: new Date().getTime() + maxWaitTime,
            resolve,
            reject,
            request
        });
    }

    private tryRemoveInvalidItem = (force: boolean = false) => {
        const {waitQueue, maxWaitLength} = this;
        const oldLength = waitQueue.length;
        if (oldLength == 0) {
            return;
        }
        const needRemove = force || oldLength < maxWaitLength;
        if (needRemove) {
            return;
        }
        const currentTime = new Date().getTime();
        const newQueue = waitQueue.filter((item) => {
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
        this.maxWaitLength--;
    };

    private rejectHttpRequest = (item: WaitHttpRequest<T>) => {

        if (item == null) {
            return;
        }

        const {reject, request} = item;
        reject(request);
    }
}


interface WaitHttpRequest<T> {

    expireTime: number;

    resolve: (value?: any | PromiseLike<any>) => void;

    reject: (reason?: any) => void;

    request: T
}
