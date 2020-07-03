import {WebviewBridgeMessageSender} from '../WebviewBridgeMessageSender';
import {InvokeModuleMessage, InvokeResultMessage} from "../MessageStructure";
import {WebviewBridgeMessageProcessor} from "../WebviewBridgeMessageProcessor";


export interface BrowserBridgeMessageSender extends WebviewBridgeMessageSender<InvokeModuleMessage> {

}

export interface BrowserBridgeMessageProcessor extends WebviewBridgeMessageProcessor<(message: InvokeResultMessage) => void>, BrowserBridgeMessageSender {

}
