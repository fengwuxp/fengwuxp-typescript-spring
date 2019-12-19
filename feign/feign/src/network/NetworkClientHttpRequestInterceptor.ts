import {HttpRequest} from "../client/HttpRequest";
import {ClientHttpRequestInterceptorInterface} from "../client/ClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "./NetworkStatusListener";
import {NoneNetworkFailBack} from "./NoneNetworkFailBack";
import SimpleNetworkStatusListener from "./SimpleNetworkStatusListener";


/**
 * It needs to be configured first in the {@see ClientHttpRequestInterceptorInterface} list
 *
 * Check whether the client network is available and can be degraded with custom processing.
 * For example, stack requests until the network is available or abandon the request
 *
 * Network interception interceptor during the execution of http client, which conflicts with {@see NetworkFeignClientExecutorInterceptor}
 */
export default class NetworkClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {

    private networkStatusListener: NetworkStatusListener = null;

    private noneNetworkHandler: NoneNetworkFailBack<T> = null;

    private networkStatus: NetworkStatus = null;

    // private static HANDLE_FAIL_BACK_FLAG = 0;


    // Number of spin attempts to wait for network recovery
    private tryWaitNetworkCount: number;

    // Maximum number of milliseconds for spin wait
    private spinWaitMaxTimes: number;

    constructor(networkStatusListener: NetworkStatusListener,
                noneNetworkHandler?: NoneNetworkFailBack<T>,
                tryWaitNetworkCount?: number,
                spinWaitMaxTimes?: number) {
        this.networkStatusListener = networkStatusListener;
        this.noneNetworkHandler = noneNetworkHandler || new SimpleNetworkStatusListener();
        this.tryWaitNetworkCount = tryWaitNetworkCount || 3;
        if (this.tryWaitNetworkCount > 10) {
            throw new Error(`try wait count to max: ${tryWaitNetworkCount}`);
        }
        this.spinWaitMaxTimes = spinWaitMaxTimes || 500;
        if (this.spinWaitMaxTimes > 1200) {
            throw new Error(`try wait times to max: ${spinWaitMaxTimes}`);
        }

        this.initNetwork();
        this.networkStatusListener.onChange((newNetworkStatus) => {
            if (newNetworkStatus == null) {
                newNetworkStatus = {
                    networkType: NetworkType.NONE,
                    isConnected: false
                }
            }
            const {networkStatus} = this;
            if (networkStatus == null) {
                return
            }
            if (!networkStatus.isConnected && newNetworkStatus.isConnected) {
                // 网络被激活
                this.noneNetworkHandler.onNetworkActive()
            }
            this.networkStatus = newNetworkStatus;
        });
    }


    interceptor = async (req: T) => {
        const {networkStatus} = this;
        const noneNetwork = networkStatus == null || !networkStatus.isConnected;
        if (noneNetwork) {
            return this.trySpinWait(req).catch(this.handleFailBack);
        } else {
            return req;
        }
    };

    private initNetwork = () => {
        return this.networkStatusListener.getNetworkStatus()
            .then((networkStatus) => this.networkStatus = networkStatus)
            .catch(() => {
                this.networkStatus = {
                    isConnected: false,
                    networkType: NetworkType.NONE
                }
            });
    };

    //无网络时的降级处理
    private handleFailBack = async (req: T): Promise<T> => {

        // if (NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG > 0) {
        //     return Promise.reject(req);
        // }
        // try {
        //     NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG++;
        //     await this.noneNetworkHandler.onNetworkClose(req);
        //     NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG--;
        // } catch (e) {
        //     NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG--;
        //     return Promise.reject(e);
        // }

        await this.noneNetworkHandler.onNetworkClose(req);

        return req;
    };

    /**
     * try spin wait network
     */
    private trySpinWait = async (req: T) => {
        let {tryWaitNetworkCount, spinWaitMaxTimes} = this;

        if (tryWaitNetworkCount == 0) {
            return Promise.reject(req);
        }
        while (tryWaitNetworkCount-- > 0 && (this.networkStatus == null || !this.networkStatus.isConnected)) {
            // console.log("自旋等待网络恢复");
            let times = spinWaitMaxTimes * Math.random();
            if (times < 120) {
                times = 120;
            }
            await sleep(times);
            await this.initNetwork();
        }
        if (this.networkStatus.isConnected) {
            // console.log("网络已恢复");
            return Promise.resolve(req);
        }
        return Promise.reject(req);
    }

}


const sleep = (times) => {
    return new Promise((resolve) => {
        setTimeout(resolve, times)
    });
};


