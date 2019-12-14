import {
    AppCommandStorage,
    appCommandStorageFactory,
    StorageAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";
import TarojsStorageAdapter from "./TarojsStorageAdapter";
import {reduceRightCommandResolvers, toLineResolver, toUpperCaseResolver} from "fengwuxp-declarative-command";

/**
 * tarojs command storage factory
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
export const tarojsAppCommandStorageFactory = <T extends AppCommandStorage,
    N extends StorageAdapter = StorageAdapter>(pathPrefix?: string, storageUpdateStrategy?: StorageUpdateStrategy): T & N => {

    return appCommandStorageFactory<T, N>({
        methodNameCommandResolver: () => reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver),
        storageAdapter: () => new TarojsStorageAdapter(),
        storageUpdateStrategy: () => storageUpdateStrategy
    }, pathPrefix);
};
