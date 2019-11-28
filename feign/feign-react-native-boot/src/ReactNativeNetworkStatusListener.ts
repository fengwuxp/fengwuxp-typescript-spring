import NetInfo, {NetInfoStateType} from "@react-native-community/netinfo";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "fengwuxp-typescript-feign";

/**
 * react-native nework status listener
 */
export default class ReactNativeNetworkStatusListener implements NetworkStatusListener {

    getNetworkStatus = (): Promise<NetworkStatus> => {

        return NetInfo.fetch().then(netInfoDisconnectedState => {
            const {type, isConnected, details} = netInfoDisconnectedState;
            if (type == null || details == null) {
                return Promise.reject(null)
            }
            let networkType;
            const {cellularGeneration, isConnectionExpensive} = details as any;
            if (isConnectionExpensive) {
                // 需要付费的网络，例如 移动4G 等
                if (cellularGeneration == null) {
                    return Promise.reject(null);
                }
                networkType = cellularGeneration;
            } else {
                networkType = this.converterStateType(type);
            }
            if (networkType == null || networkType === NetworkType.NONE) {
                return Promise.reject(null);
            }

            return {
                networkType,
                isConnected
            };
        })
    };

    onChange = (callback: (networkStatus: NetworkStatus) => void) => {
        NetInfo.addEventListener(state => {
            callback({
                networkType: this.converterStateType(state.type),
                isConnected: state.isConnected
            });
        });
    };

    // NONE - 设备处于离线状态
    // BLUETOOTH - 蓝牙数据连接
    // DUMMY - 模拟数据连接
    // ETHERNET - 以太网数据连接
    // MOBILE - 移动网络数据连接
    // MOBILE_DUN - 拨号移动网络数据连接
    // MOBILE_HIPRI - 高优先级移动网络数据连接
    // MOBILE_MMS - 彩信移动网络数据连接
    // MOBILE_SUPL - 安全用户面定位（SUPL）数据连接
    // VPN - 虚拟网络连接。需要Android5.0以上
    // WIFI - WIFI数据连接
    // WIMAX - WiMAX数据连接
    // UNKNOWN - 未知数据连接

    private converterStateType = (type: NetInfoStateType): NetworkType => {
        switch (type) {
            case NetInfoStateType.none:
                return NetworkType.NONE;
            case NetInfoStateType.bluetooth:
            case NetInfoStateType.ethernet:
            case NetInfoStateType.cellular:
            case NetInfoStateType.other:
            case NetInfoStateType.unknown:
            case NetInfoStateType.vpn:
            case NetInfoStateType.wimax:
                return NetworkType.UN_KNOWN;

            case NetInfoStateType.wifi:
                return NetworkType.WIFI;

            default:
                throw new Error(`not support network type: ${type}`)

        }
    }


}
