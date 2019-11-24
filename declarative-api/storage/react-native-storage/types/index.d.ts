import { StorageAdapter, GetStorageOptions, StorageUpdateStrategy, PersistenceStorageOptions, AppCommandStorage } from 'fengwuxp-declarative-storage-adapter';

declare class ReactNativeStorageAdapter implements StorageAdapter {
    clearAll: () => Promise<void>;
    getKeys: () => Promise<string[]>;
    getStorage: <T = string>(key: string, options?: true | GetStorageOptions | StorageUpdateStrategy) => Promise<T>;
    removeStorage: (key: string | string[]) => Promise<string | string[]>;
    setStorage: (key: string, data: string, options?: number | PersistenceStorageOptions) => Promise<void>;
}

/**
 * app command storage factory
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
declare const reactNativeAppCommandStorageFactory: <T extends AppCommandStorage, N extends StorageAdapter = StorageAdapter>(pathPrefix?: string, storageUpdateStrategy?: StorageUpdateStrategy) => T & N;

export { ReactNativeStorageAdapter, reactNativeAppCommandStorageFactory };
