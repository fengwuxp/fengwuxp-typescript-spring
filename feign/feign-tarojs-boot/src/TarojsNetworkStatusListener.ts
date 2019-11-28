import {NetworkStatus, NetworkStatusListener, NetworkType} from "fengwuxp-typescript-feign";

/**
 * tarojs network status listener
 */
export default class TarojsNetworkStatusListener implements NetworkStatusListener {

    getNetworkStatus = (): Promise<NetworkStatus> => {
        return Taro.getNetworkType().then(({networkType}) => {
            if (networkType == null || networkType === NetworkType.NONE) {
                return Promise.reject(null)
            } else {
                return {
                    networkType,
                    isConnected: true
                };
            }
        })
    };

    onChange = (callback: (networkStatus: NetworkStatus) => void) => {
        Taro.onNetworkStatusChange(({isConnected, networkType}) => {
            callback({
                networkType,
                isConnected
            } as NetworkStatus)
        })
    };


}
