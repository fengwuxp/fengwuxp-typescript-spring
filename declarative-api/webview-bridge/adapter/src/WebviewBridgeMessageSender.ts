/**
 * 消息发送者
 */
export interface WebviewBridgeMessageSender<T = any> {

    /**
     * post message
     * @param message
     */
    postMessage: (message: T) => void
}
