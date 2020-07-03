import {BrowserNativeModuleProvider} from "./BrowserNativeModuleProvider";
import {InvokeResultMessage} from "../MessageStructure";
import {BrowserNativeModuleInterface} from "./BrowserNativeModuleInterface";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import {BrowserBridgeMessageProcessor} from "./BrowserBridgeMessageProcessor";


type WaitItem = {
    resolve: Function,
    reject: Function
}

/**
 * 代理的模块提供者
 */
export default class ProxyBrowserNativeModuleProvider implements BrowserNativeModuleProvider {

    private bridgeMessageProcessor: BrowserBridgeMessageProcessor;

    private invokeMap: Map<number, WaitItem> = new Map<number, WaitItem>();

    private messageId: number = 0;

    constructor(bridgeMessageProcessor: BrowserBridgeMessageProcessor) {
        this.bridgeMessageProcessor = bridgeMessageProcessor;
        const invokeMap = this.invokeMap;
        bridgeMessageProcessor.onMessage((message: InvokeResultMessage) => {
            if (message == null) {
                console.log("message is null");
                return
            }
            const key = message.id;
            const waitItem = invokeMap.get(key);
            if (waitItem == null) {
                console.log("not found wait element，id: " + key);
            } else {
                if (message.error) {
                    waitItem.reject(message.error);
                }
                if (message.result) {
                    waitItem.resolve(message.result);
                }
                invokeMap.delete(key)
            }
        })
    }

    getModule = <T extends BrowserNativeModuleInterface>(moduleName: string) => {
        const {invokeMap, bridgeMessageProcessor} = this;
        const that = this;
        return newProxyInstanceEnhance({} as T, null,
            (
                object: any,
                propertyKey: string,
                receiver: any
            ) => {

                return function (...args) {

                    return new Promise((resolve, reject) => {
                        const id = that.messageId++;
                        invokeMap.set(id, {
                            reject,
                            resolve
                        });

                        bridgeMessageProcessor.postMessage({
                            id,
                            moduleName,
                            memberName: propertyKey,
                            args
                        })
                    })

                }

            })
    };

}

