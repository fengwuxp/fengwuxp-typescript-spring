import {
    browserNativeModuleProviderFactory,
    InvokeModuleMessage,
    InvokeResultMessage, ProxyBrowserNativeModuleProvider
} from "fengwuxp-declarative-webview-bridge-adapter/browser"
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";


export const isReactNativeWebView = window["ReactNativeWebView"] != null;
const userAgent = navigator.userAgent;
const BROWSER_ENV = {

    //ios终端
    IOS: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    //android终端
    ANDROID: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1,

};


export const browserReactNativeModuleProviderFactory = (): ProxyBrowserNativeModuleProvider => {
    if (!isReactNativeWebView) {
        // throw new Error("not react-native webview")
        return {
            getModule: (moduleName: string) => {
                newProxyInstanceEnhance({}, null, () => {
                    return function (...args) {
                        console.log("not react-native webview",args)
                    }
                });
            }
        } as any
    }

    return browserNativeModuleProviderFactory({
        onMessage: function (listener: (message: InvokeResultMessage) => void) {
            const type = "message";
            const wrapperListener = (message: string) => {
                if (!StringUtils.isJSONString(message)) {
                    return;
                }
                const invokeResultMessage: InvokeResultMessage = JSON.parse(message);
                console.log("onMessage", invokeResultMessage);
                listener(invokeResultMessage);
            };

            if (BROWSER_ENV.ANDROID) {
                // @ts-ignore
                document.addEventListener(type, wrapperListener);
            } else if (BROWSER_ENV.IOS) {
                // @ts-ignore
                window.addEventListener(type, wrapperListener);
            } else {
                console.warn("not support")
            }
        },
        postMessage: function (message: InvokeModuleMessage) {
            window["ReactNativeWebView"].postMessage(JSON.stringify(message));
        }

    })
};

