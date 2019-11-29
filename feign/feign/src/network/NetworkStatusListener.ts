/**
 * Network status listener
 */
export interface NetworkStatusListener {

    /**
     * get network status
     */
    getNetworkStatus: () => Promise<NetworkStatus>;


    /**
     * listener
     */
    onChange: (callback: (networkStatus: NetworkStatus) => void) => void;
}

// wifi	wifi 网络
// 2g	2g 网络
// 3g	3g 网络
// 4g	4g 网络
// unknown	Android 下不常见的网络类型
// none	无网络
export interface NetworkStatus {

    /**
     * 当前是否有网络连接
     */
    isConnected: boolean;

    /**
     * 网络类型
     */
    networkType: NetworkType;
}

export enum NetworkType {

    WIFI = "wifi",

    "2G" = "2g",

    "3G" = "3g",

    "4G" = "4g",

    "5G" = "5g",

    /**
     * Android 下不常见的网络类型
     */
    UN_KNOWN = "unknown",

    /**
     * 无网络
     */
    NONE = "none",
}

