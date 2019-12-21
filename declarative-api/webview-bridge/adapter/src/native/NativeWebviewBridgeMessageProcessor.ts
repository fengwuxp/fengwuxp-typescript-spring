import {InvokeModuleMessage, InvokeResultMessage} from "../MessageStructure";
import {getModule, OpenModuleInterface} from "./NativeModuleProvider";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import {WebviewBridgeMessageSender} from "../WebviewBridgeMessageSender";
import {WebviewBridgeMessageProcessor} from "../WebviewBridgeMessageProcessor";


export interface NativeWebviewBridgeMessageSender extends WebviewBridgeMessageSender<InvokeResultMessage> {

}


/**
 * 默认的webview bridge 处理者
 */
export default class NativeWebviewBridgeMessageProcessor implements WebviewBridgeMessageProcessor<string> {


    private nativeWebviewBridgeMessageSender: NativeWebviewBridgeMessageSender;

    constructor(nativeWebviewBridgeMessageSender: NativeWebviewBridgeMessageSender) {
        this.nativeWebviewBridgeMessageSender = nativeWebviewBridgeMessageSender;
    }

    onMessage = (message: string) => {

        if (message == null) {
            return
        }

        if (!StringUtils.isJSONString(message)) {
            return;
        }

        const invokeModuleMessage: InvokeModuleMessage = JSON.parse(message);
        if (invokeModuleMessage.id == null || invokeModuleMessage.memberName == null) {
            return;
        }

        const {id, memberName, moduleName, args} = invokeModuleMessage;

        const module = getModule(moduleName);

        if (module == null) {
            this.sendModuleNotFoundMessage(id, `module：${moduleName} not found`);
            return;
        }

        const moduleElement = module[memberName];
        if (moduleElement == null) {
            this.sendModuleNotFoundMessage(id, `module ${module} member ：${memberName} not found`);
            return;
        }

        if (typeof moduleElement === "function") {
            this.invokeModuleMethod(module, memberName, id, args);
        } else {
            this.postMessage({
                id,
                result: moduleElement
            });
        }


    };


    /**
     * 执行模块方法
     * @param module
     * @param memberName
     * @param id
     *  @param args
     */
    private invokeModuleMethod(module: OpenModuleInterface, memberName: string, id: number, args?: any[]) {
        // 为了保证this指向不变，
        const result = module[memberName](...args);
        const isPromise = this.isPromise(result);

        if (isPromise) {
            result.then((data) => {
                this.postMessage({
                    id,
                    result: data
                });
            }).catch((error) => {
                this.sendInvokeErrorMessage(id, error);
            })
        } else {
            this.postMessage({
                id,
                result
            });
        }
    }

    private postMessage = (message: InvokeResultMessage) => {
        this.nativeWebviewBridgeMessageSender.postMessage(message);
    };


    private sendModuleNotFoundMessage = (messageId: number, message: string) => {
        this.postMessage({
            id: messageId,
            error: message
        })
    };

    private sendInvokeErrorMessage = (messageId: number, message: string) => {
        this.postMessage({
            id: messageId,
            error: message
        })
    };

    private isPromise = (result) => {
        if (result == null) {
            return false;
        }

        return typeof result.then === "function" && typeof result.catch === "function";
    }

}

