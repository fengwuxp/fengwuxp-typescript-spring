import ProxyBrowserNativeModuleProvider from "./ProxyBrowserNativeModuleProvider";
import {BrowserBridgeMessageProcessor} from "./BrowserBridgeMessageProcessor";


export const browserNativeModuleProviderFactory = (bridgeMessageProcessor: BrowserBridgeMessageProcessor) => {

    return new ProxyBrowserNativeModuleProvider(bridgeMessageProcessor);
};
