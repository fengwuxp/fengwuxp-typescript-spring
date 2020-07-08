import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import { InvokeResultMessage, WebviewBridgeMessageProcessor, WebviewBridgeMessageSender } from "fengwuxp-declarative-webview-bridge-adapter/types";
export interface ReactNativeWebviewBridgeMessageProcessor {
    onMessage: (event: WebViewMessageEvent) => void;
    postMessage: (message: any) => void;
}
export declare const reactNativeWebviewBridgeFactory: (webview: any) => WebviewBridgeMessageProcessor<string> & WebviewBridgeMessageSender<InvokeResultMessage>;
