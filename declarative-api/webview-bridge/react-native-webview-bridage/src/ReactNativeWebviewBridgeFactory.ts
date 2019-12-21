import {WebViewMessageEvent} from "react-native-webview/lib/WebViewTypes";
import {
    NativeWebviewBridgeMessageProcessor,
} from "fengwuxp-declarative-webview-bridge-adapter/lib";
import {
    InvokeResultMessage,
    WebviewBridgeMessageProcessor,
    WebviewBridgeMessageSender
} from "fengwuxp-declarative-webview-bridge-adapter/types";

export interface ReactNativeWebviewBridgeMessageProcessor {

    onMessage: (event: WebViewMessageEvent) => void;

    postMessage: (message: any) => void;
}

export const reactNativeWebviewBridgeFactory = (webview): WebviewBridgeMessageProcessor<string> & WebviewBridgeMessageSender<InvokeResultMessage> => {

    const webviewBridgeMessageProcessor = new NativeWebviewBridgeMessageProcessor(webview);

    return {
        onMessage: function (event: WebViewMessageEvent) {
            const data = event.nativeEvent.data;
            if (data == null) {
                return;
            }
            webviewBridgeMessageProcessor.onMessage(data as any);
        },

        postMessage: function (event: any) {
            webview.postMessage(JSON.stringify(event));
        }

    }
};
