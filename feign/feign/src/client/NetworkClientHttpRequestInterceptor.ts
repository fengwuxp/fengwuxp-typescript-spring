import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "./NetworkStatusListener";
import {NoneNetworkFailBack} from "./NoneNetworkFailBack";
import SimpleNetworkStatusListener from "./SimpleNetworkStatusListener";


/**
 * Check whether the client network is available and can be degraded with custom processing.
 * For example, stack requests until the network is available or abandon the request
 */
export default class NetworkClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {

    private networkStatusListener: NetworkStatusListener = null;

    private noneNetworkHandler: NoneNetworkFailBack<T> = null;

    private networkStatus: NetworkStatus = null;

    private static HANDLE_FAIL_BACK_FLAG = 0;

    constructor(networkStatusListener: NetworkStatusListener,
                noneNetworkHandler?: NoneNetworkFailBack<T>) {
        this.networkStatusListener = networkStatusListener;
        this.noneNetworkHandler = noneNetworkHandler || new SimpleNetworkStatusListener();

        this.networkStatusListener.getNetworkStatus()
            .then((networkStatus) => this.networkStatus = networkStatus)
            .catch(() => {
                this.networkStatus = {
                    isConnected: false,
                    networkType: NetworkType.NONE
                }
            });
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

        if (networkStatus == null || !networkStatus.isConnected) {
            return this.handleFailBack(req);
        } else {
            return req;
        }
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
    }

}





