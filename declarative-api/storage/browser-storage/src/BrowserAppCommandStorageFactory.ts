import {
    AppCommandStorage,
    appCommandStorageFactory,
    StorageAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";
import {reduceRightCommandResolvers, toLineResolver, toUpperCaseResolver} from "fengwuxp-declarative-command";
import BrowserStorageAdapter from './BrowserStorageAdapter';

/**
 * browser app command storage factory
 * @param storageAdapter
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
export const browserAppCommandStorageFactory = <T extends AppCommandStorage,
    N extends StorageAdapter = StorageAdapter>(storageAdapter?: StorageAdapter,
                                               pathPrefix?: string,
                                               storageUpdateStrategy?: StorageUpdateStrategy): T & N => {

    return appCommandStorageFactory<T, N>({
        methodNameCommandResolver: () => reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver),
        storageAdapter: () => storageAdapter || new BrowserStorageAdapter(),
        storageUpdateStrategy: () => storageUpdateStrategy
    }, pathPrefix);
};
