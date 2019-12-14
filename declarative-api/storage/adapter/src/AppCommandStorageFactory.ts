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
import {DefaultWrapperStorageSyncAdapter} from "./DefaultWrapperStorageSyncAdapter";


const STORAGE_COMMAND_VALUES = Object.keys(StorageCommand).map((key) => {
    return StorageCommand[key]
});


const SYNC_METHOD_SUFFIX = "Sync";

/**
 * app command storage factory
 * @param configuration
 * @param pathPrefix
 */
export const appCommandStorageFactory = <T extends AppCommandStorage,
    N extends StorageAdapter = StorageAdapter>(configuration: StorageCommandConfiguration, pathPrefix?: string): T & N => {


    const methodNameCommandResolver = typeof configuration.methodNameCommandResolver == "function" ? configuration.methodNameCommandResolver() : reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver);
    const adapter = configuration.storageAdapter();
    const adapterArgs = [
        adapter,
        pathPrefix,
        typeof configuration.storageUpdateStrategy !== "function" ? undefined : configuration.storageUpdateStrategy()
    ];
    const isSupportSync = typeof adapter.setStorageSync === "function";
    // @ts-ignore
    const storageAdapter: StorageAdapter = isSupportSync ? new DefaultWrapperStorageSyncAdapter(...adapterArgs) : new DefaultWrapperStorageAdapter(...adapterArgs);

    return newProxyInstanceEnhance<T & N>(storageAdapter as any, null,
        (object, propertyKey: string, receiver) => {

            const isSyncMethod = propertyKey.endsWith(SYNC_METHOD_SUFFIX);

            return function (...args: any[]) {
                //尝试从方法名称中解析到 指令
                let [command, storageKey] = tryConverterMethodNameCommandResolver(propertyKey, STORAGE_COMMAND_VALUES, StorageCommand.GET);
                storageKey = storageKey.replace(storageKey[0], storageKey[0].toLocaleLowerCase());
                storageKey = methodNameCommandResolver(storageKey);
                switch (command) {
                    case StorageCommand.GET:
                        return isSyncMethod ? storageAdapter.getStorageSync(storageKey) : storageAdapter.getStorage(storageKey, ...args);
                    case StorageCommand.SET:
                        // @ts-ignore
                        return isSyncMethod ? storageAdapter.setStorageSync(storageKey, ...args) : storageAdapter.setStorage(storageKey, ...args);
                    case StorageCommand.REMOVE:
                        return isSyncMethod ? storageAdapter.removeStorageSync(storageKey) : storageAdapter.removeStorage(storageKey);
                    case StorageCommand.CLEAR:
                        return storageAdapter.clearAll();
                    default:
                        throw new Error(`not support command: ${command}`);
                }
            }
        })
};
