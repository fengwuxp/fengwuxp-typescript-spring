import {InvokeModuleMessage} from "./MessageStructure";

export interface WebviewBridgeMessageListener {

    /**
     * on message
     * @param message
     */
    onMessage: (message: InvokeModuleMessage) => void;
}
