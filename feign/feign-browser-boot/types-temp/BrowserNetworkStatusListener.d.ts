import { NetworkStatus, NetworkStatusListener } from "fengwuxp-typescript-feign";
export declare enum BrowserNetworkStatus {
    unknown = "unknown",
    ethernet = "ethernet",
    wifi = "wifi",
    "2g" = "2g",
    "3g" = "3g",
    "4g" = "4g",
    "none" = "none"
}
/**
 * browser network status listener
 */
export default class BrowserNetworkStatusListener implements NetworkStatusListener {
    getNetworkStatus: () => Promise<NetworkStatus>;
    onChange: (callback: (networkStatus: NetworkStatus) => void) => void;
    private processNetworkStats;
    private converterStateType;
    private getBrowserNetworkStatus;
}
