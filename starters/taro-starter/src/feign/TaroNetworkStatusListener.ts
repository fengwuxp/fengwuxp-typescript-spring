import {NetworkStatus, NetworkStatusListener,NetworkType} from "fengwuxp-typescript-feign";
import TaroJsHolder from "../TaroJsHolder";


export default class TaroNetworkStatusListener implements NetworkStatusListener {

    getNetworkStatus = (): Promise<NetworkStatus> => {
        return TaroJsHolder.getTaroHolder().taro.getNetworkType().then(({networkType}) => {
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
        TaroJsHolder.getTaroHolder().taro.onNetworkStatusChange(({isConnected, networkType}) => {
            callback({
                networkType,
                isConnected
            } as NetworkStatus)
        })
    };


}
