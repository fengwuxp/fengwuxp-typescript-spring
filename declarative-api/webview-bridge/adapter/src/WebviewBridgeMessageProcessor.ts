export interface WebviewBridgeMessageProcessor<T> {

    onMessage: (message: T) => void;
}
