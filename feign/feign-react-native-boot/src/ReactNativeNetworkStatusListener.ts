import NetInfo, {NetInfoStateType} from "@react-native-community/netinfo";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "fengwuxp-typescript-feign";

/**
 * react-native network status listener
 */
export default class ReactNativeNetworkStatusListener implements NetworkStatusListener {

    getNetworkStatus = (): Promise<NetworkStatus> => {

        return NetInfo.fetch().then((networkState) => {
            const networkStats = this.processNetworkStats(networkState);
            if (networkStats == null) {
                return Promise.reject(networkStats);
            } else {
                return Promise.resolve(networkStats);
            }
        });
    };

    onChange = (callback: (networkStatus: NetworkStatus) => void) => {
        // {"details":{"carrier":"中国移动","cellularGeneration":"4g","isConnectionExpensive":true},"isConnected":true,"isInternetReachable":true,"type":"cellular"}
        NetInfo.addEventListener(state => {
            callback(this.processNetworkStats(state));
        });
    };

    private processNetworkStats = (networkState): NetworkStatus => {
        const {type, isConnected, details} = networkState;
        if (type == null || details == null) {
            return null
        }
        let networkType;
        const {cellularGeneration, isConnectionExpensive} = details as any;
        if (isConnectionExpensive) {
            // 需要付费的网络，例如 移动4G 等
            if (cellularGeneration == null) {
                return null;
            }
            networkType = cellularGeneration;
        } else {
            networkType = this.converterStateType(type);
        }
        if (networkType == null || networkType === NetworkType.NONE) {
            return null
        }

        return {
            networkType,
            isConnected
        }
    };


    private converterStateType = (type: NetInfoStateType): NetworkType => {
        switch (type) {
            case NetInfoStateType.none:
                return NetworkType.NONE;
            case NetInfoStateType.bluetooth:
            case NetInfoStateType.ethernet:
            case NetInfoStateType.other:
            case NetInfoStateType.unknown:
            case NetInfoStateType.vpn:
            case NetInfoStateType.wimax:
                return NetworkType.UN_KNOWN;
            case NetInfoStateType.cellular:
                return  NetworkType["4G"];
            case NetInfoStateType.wifi:
                return NetworkType.WIFI;

            default:
                throw new Error(`not support network type: ${type}`)

        }
    }


}
