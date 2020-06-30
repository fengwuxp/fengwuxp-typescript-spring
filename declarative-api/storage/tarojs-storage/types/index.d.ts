import { AppCommandStorage, StorageAdapter, StorageUpdateStrategy, StorageSyncAdapter, GetStorageOptions, PersistenceStorageOptions } from 'fengwuxp-declarative-storage-adapter';

/**
 * tarojs command storage factory
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
declare const tarojsAppCommandStorageFactory: <T extends AppCommandStorage, N extends StorageAdapter = StorageAdapter>(pathPrefix?: string, storageUpdateStrategy?: StorageUpdateStrategy) => T & N;

/**
 * tarojs storage adapter
 */
declare class TarojsStorageAdapter implements StorageAdapter, StorageSyncAdapter {
    constructor();
    clearAll: () => Promise<any>;
    getKeys: () => Promise<never>;
    getStorage: <T = string>(key: string, options?: (GetStorageOptions | true | StorageUpdateStrategy)) => Promise<T>;
    removeStorage: (key: (string | string[])) => any;
    setStorage: (key: string, data: string, options?: (number | PersistenceStorageOptions)) => any;
    getStorageSync: <T = any>(key: string) => any;
    removeStorageSync: (key: (string | string[])) => void;
    setStorageSync: (key: string, data: (object | string | boolean | number), options?: PersistenceStorageOptions) => void;
}

export { TarojsStorageAdapter, tarojsAppCommandStorageFactory };
