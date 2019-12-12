import {NetworkStatus, NetworkStatusListener, NetworkType} from "fengwuxp-typescript-feign";


// ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none']
export enum BrowserNetworkStatus {
    unknown = "unknown",
    ethernet = "ethernet",
    wifi = "wifi",
    "2g" = "2g",
    "3g" = "3g",
    "4g" = "4g",
    "none" = "none"
}

const NETWORK_TYPES = [
    BrowserNetworkStatus.unknown,
    BrowserNetworkStatus.ethernet,
    BrowserNetworkStatus.wifi,
    BrowserNetworkStatus["2g"],
    BrowserNetworkStatus["3g"],
    BrowserNetworkStatus["4g"],
    BrowserNetworkStatus["none"],
];

// @ts-ignore
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {type: BrowserNetworkStatus.none};

/**
 * browser network status listener
 */
export default class BrowserNetworkStatusListener implements NetworkStatusListener {

    getNetworkStatus = (): Promise<NetworkStatus> => {

        return Promise.resolve(this.processNetworkStats());
    };

    onChange = (callback: (networkStatus: NetworkStatus) => void) => {
        connection.onchange = () => {
            callback(this.processNetworkStats());
        }
    };

    private processNetworkStats = (): NetworkStatus => {
        return {
            networkType: this.converterStateType(),
            isConnected: navigator.onLine
        }
    };


    private converterStateType = (): NetworkType => {
        switch (this.getBrowserNetworkStatus()) {
            case BrowserNetworkStatus.wifi:
                return NetworkType.WIFI;
            case BrowserNetworkStatus.ethernet:
            case BrowserNetworkStatus.unknown:
                return NetworkType.UN_KNOWN;
            case BrowserNetworkStatus.none:
                return NetworkType.NONE;
            case BrowserNetworkStatus["2g"]:
                return NetworkType["2G"];
            case BrowserNetworkStatus["3g"]:
                return NetworkType["3G"];
            case BrowserNetworkStatus["4g"]:
                return NetworkType["4G"];
            default:
                return NetworkType.NONE
        }
    };

    private getBrowserNetworkStatus = () => {

        if (typeof connection.type === "number") {
            return NETWORK_TYPES[connection.type]
        }
        if (typeof connection.bandwidth === "number") {
            if (connection.bandwidth > 10) {
                return BrowserNetworkStatus.wifi;
            } else if (connection.bandwidth > 2) {
                return BrowserNetworkStatus["3g"]
            } else if (connection.bandwidth > 0) {
                return BrowserNetworkStatus["2g"]
            } else if (connection.bandwidth == 0) {
                return BrowserNetworkStatus.none;
            } else {
                return BrowserNetworkStatus.unknown;
            }
        }

        return connection.type;

    }

}
