import {BrowserNativeModuleInterface} from "./BrowserNativeModuleInterface";


export interface BrowserNativeModuleProvider {

    getModule: <T extends BrowserNativeModuleInterface>(moduleName: string) => T;
}
