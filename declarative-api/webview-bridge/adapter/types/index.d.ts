/**
 * invoke module message structure
 */
interface InvokeModuleMessage {
    id: number;
    moduleName: string;
    memberName: string;
    args?: any[];
}
/**
 *  invoke result message structure
 */
interface InvokeResultMessage {
    id: number;
    result?: any;
    error?: any;
}

/**
 * 消息发送者
 */
interface WebviewBridgeMessageSender<T = any> {
    /**
     * post message
     * @param message
     */
    postMessage: (message: T) => void;
}

interface WebviewBridgeMessageProcessor<T> {
    onMessage: (message: T) => void;
}

interface OpenModuleInterface {
    [key: string]: any;
}
/**
 * 注册模块
 * @param moduleName
 * @param module
 */
declare const registerModule: (moduleName: string, module: OpenModuleInterface) => void;
/**
 * 获取模块
 * @param module
 */
declare const getModule: <T extends OpenModuleInterface>(module: string) => T;

interface NativeWebviewBridgeMessageSender extends WebviewBridgeMessageSender<InvokeResultMessage> {
}
/**
 * 默认的webview bridge 处理者
 */
declare class NativeWebviewBridgeMessageProcessor implements WebviewBridgeMessageProcessor<string> {
    private nativeWebviewBridgeMessageSender;
    constructor(nativeWebviewBridgeMessageSender: NativeWebviewBridgeMessageSender);
    onMessage: (message: string) => void;
    /**
     * 执行模块方法
     * @param module
     * @param memberName
     * @param id
     *  @param args
     */
    private invokeModuleMethod;
    private postMessage;
    private sendModuleNotFoundMessage;
    private sendInvokeErrorMessage;
    private isPromise;
}

export { InvokeModuleMessage, InvokeResultMessage, NativeWebviewBridgeMessageProcessor, NativeWebviewBridgeMessageSender, WebviewBridgeMessageProcessor, WebviewBridgeMessageSender, getModule, registerModule };
