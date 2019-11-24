import {
    AppCommandStorage,
    appCommandStorageFactory,
    StorageAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";
import ReactNativeStorageAdapter from "./ReactNativeStorageAdapter";
import {reduceRightCommandResolvers, toLineResolver, toUpperCaseResolver} from "fengwuxp-declarative-command";

/**
 * app command storage factory
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
export const reactNativeAppCommandStorageFactory = <T extends AppCommandStorage,
    N extends StorageAdapter = StorageAdapter>(pathPrefix?: string, storageUpdateStrategy?: StorageUpdateStrategy): T & N => {

    return appCommandStorageFactory<T, N>({
        methodNameCommandResolver: () => reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver),
        storageAdapter: () => new ReactNativeStorageAdapter(),
        storageUpdateStrategy: () => storageUpdateStrategy
    }, pathPrefix);
};
