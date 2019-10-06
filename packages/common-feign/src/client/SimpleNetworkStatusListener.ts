import {NoneNetworkFailBack} from "./NoneNetworkFailBack";
import {HttpRequest} from "./HttpRequest";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";


export default class SimpleNetworkStatusListener<T extends HttpRequest = HttpRequest> implements NoneNetworkFailBack<T> {


    private waitQueue: Array<WaitHttpRequest<T>> = [];

    private maxWaitTime = 5 * 60 * 1000;

    private maxWaitLength = 16;


    /**
     * @param maxWaitTime
     * @param maxWaitLength
     */
    constructor(maxWaitTime?: number, maxWaitLength?: number) {
        this.maxWaitTime = maxWaitTime;
        this.maxWaitLength = maxWaitLength;
    }

    onNetworkActive = (): (Promise<void> | void) => {
        this.tryRemoveInvalidItem(true);
        const {waitQueue} = this;
        if (waitQueue.length == 0) {
            return;
        }
        const httpClient = FeignConfigurationRegistry.getDefaultFeignConfiguration().getHttpClient();

        const newQueue = [...waitQueue];
        //clear queue
        this.waitQueue = [];

        //retry request
        newQueue.forEach(({request, resolve, reject}) => {
            httpClient.send(request).then(resolve).catch(reject);
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
        this.maxWaitLength++;
    }

    private tryRemoveInvalidItem = (force: boolean = false) => {
        const {waitQueue, maxWaitLength} = this;
        const needRemove = force || waitQueue.length < maxWaitLength;
        if (needRemove) {
            return;
        }
        const currentTime = new Date().getTime();
        const newQueue = waitQueue.filter(({expireTime}) => {
            return currentTime - expireTime < 0;
        });
        if (newQueue.length < maxWaitLength) {
            return;
        }
        // remove first item
        newQueue.shift();
        this.maxWaitLength--;
    }
}


interface WaitHttpRequest<T> {

    expireTime: number;

    resolve: (value?: any | PromiseLike<any>) => void;

    reject: (reason?: any) => void;

    request: T
}
