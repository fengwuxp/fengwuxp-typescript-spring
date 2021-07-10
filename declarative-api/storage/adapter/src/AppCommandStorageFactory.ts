import {StorageAdapter} from "./StorageAdapter";
import {AppCommandStorage} from "./AppCommandStorage";
import {StorageCommandConfiguration} from "./StorageCommandConfiguration";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import DefaultWrapperStorageAdapter from "./DefaultWrapperStorageAdapter";
import {
    reduceRightCommandResolvers,
    toLineResolver,
    toUpperCaseResolver,
    tryConverterMethodNameCommandResolver
} from "fengwuxp-declarative-command";
import {StorageCommand} from "./StorageCommand";


const STORAGE_COMMAND_VALUES = Object.keys(StorageCommand).map((key) => {
    return StorageCommand[key]
});


const SYNC_METHOD_SUFFIX = "Sync";

function getMethodNameCommandResolver(configuration: StorageCommandConfiguration) {
    return typeof configuration.methodNameCommandResolver == "function" ? configuration.methodNameCommandResolver() : reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver);
}

function getStorageUpdateStrategy(configuration: StorageCommandConfiguration) {
    return typeof configuration.storageUpdateStrategy === "function" ? configuration.storageUpdateStrategy() : undefined;
}

/**
 * app command storage factory
 * @param configuration
 * @param pathPrefix
 */
export const appCommandStorageFactory = <T extends AppCommandStorage,
    N extends StorageAdapter = StorageAdapter>(configuration: StorageCommandConfiguration, pathPrefix?: string): T & N => {

    const methodNameCommandResolver = getMethodNameCommandResolver(configuration);
    const storageAdapter: StorageAdapter = new DefaultWrapperStorageAdapter(configuration.storageAdapter(), pathPrefix, getStorageUpdateStrategy(configuration));

    return newProxyInstanceEnhance<T & N>(storageAdapter as any, null,
        (object, propertyKey: string, _) => {
            const isCallSync = propertyKey.endsWith(SYNC_METHOD_SUFFIX);
            return function (...args: any[]) {
                //尝试从方法名称中解析到 指令
                if (isCallSync) {
                    propertyKey = propertyKey.substring(0, propertyKey.length - 4);
                }
                let [command, storageKey] = tryConverterMethodNameCommandResolver(propertyKey, STORAGE_COMMAND_VALUES, StorageCommand.GET);
                storageKey = storageKey.replace(storageKey[0], storageKey[0].toLocaleLowerCase());
                storageKey = methodNameCommandResolver(storageKey);
                switch (command) {
                    case StorageCommand.GET:
                        return isCallSync ? storageAdapter.getStorageSync(storageKey) : storageAdapter.getStorage(storageKey, ...args);
                    case StorageCommand.SET:
                        // @ts-ignore
                        return isCallSync ? storageAdapter.setStorageSync(storageKey, ...args) : storageAdapter.setStorage(storageKey, ...args);
                    case StorageCommand.REMOVE:
                        return isCallSync ? storageAdapter.removeStorageSync(storageKey) : storageAdapter.removeStorage(storageKey);
                    case StorageCommand.CLEAR:
                        return storageAdapter.clearAll();
                    default:
                        throw new Error(`not support command: ${command}`);
                }
            }
        })
};
