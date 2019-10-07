import {HttpRequest} from "./HttpRequest";
import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener} from "./NetworkStatusListener";
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

        this.networkStatusListener.getNetworkStatus().then((networkStatus) => this.networkStatus = networkStatus);
        this.networkStatusListener.onChange((networkStatus) => {
            if (this.networkStatus == null) {
                return
            }
            if (!this.networkStatus.isConnected && this.networkStatus.isConnected) {
                this.noneNetworkHandler.onNetworkActive()
            }
            this.networkStatus = networkStatus;

        });
    }


    interceptor = async (req: T) => {
        const {networkStatus} = this;

        if (networkStatus != null && networkStatus.isConnected) {
            return req;
        } else {
            this.handleFailBack(req);
            return Promise.reject();
        }
    };


    //无网络时的降级处理
    private handleFailBack = async (req: T) => {
        if (NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG > 0) {
            return
        }
        try {
            NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG++;
            await this.noneNetworkHandler.onNetworkClose(req);
            NetworkClientHttpRequestInterceptor.HANDLE_FAIL_BACK_FLAG--
        } catch (e) {
            console.log(e);
        }

    }

}





