import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { WebviewBridgeMessageProcessor, WebviewBridgeMessageSender, InvokeResultMessage } from 'fengwuxp-declarative-webview-bridge-adapter/types';

interface ReactNativeWebviewBridgeMessageProcessor {
    onMessage: (event: WebViewMessageEvent) => void;
    postMessage: (message: any) => void;
}
declare const reactNativeWebviewBridgeFactory: (webview: any) => WebviewBridgeMessageProcessor<string> & WebviewBridgeMessageSender<InvokeResultMessage>;

export { ReactNativeWebviewBridgeMessageProcessor, reactNativeWebviewBridgeFactory };
