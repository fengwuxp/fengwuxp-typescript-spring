import { AppCommandStorage, StorageAdapter, StorageUpdateStrategy, GetStorageOptions, PersistenceStorageOptions } from 'fengwuxp-declarative-storage-adapter';

/**
 * browser app command storage factory
 * @param storageAdapter
 * @param pathPrefix
 * @param storageUpdateStrategy
 */
declare const browserAppCommandStorageFactory: <T extends AppCommandStorage, N extends StorageAdapter = StorageAdapter>(storageAdapter?: StorageAdapter, pathPrefix?: string, storageUpdateStrategy?: StorageUpdateStrategy) => T & N;

/**
 * browser storage adapter
 */
declare class BrowserStorageAdapter implements StorageAdapter {
    private storage;
    constructor(storage?: Storage);
    clearAll: () => void;
    getKeys: () => Promise<never>;
    getStorage: <T = string>(key: string, options?: true | GetStorageOptions | StorageUpdateStrategy) => Promise<T>;
    removeStorage: (key: string | string[]) => any;
    setStorage: (key: string, data: string, options?: number | PersistenceStorageOptions) => void;
    getStorageSync: <T = any>(key: string) => any;
    removeStorageSync: (key: string | string[]) => void;
    setStorageSync: (key: string, data: string | number | boolean | object, options?: PersistenceStorageOptions) => void;
}

export { BrowserStorageAdapter, browserAppCommandStorageFactory };
