import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * update policy when data in the store is invalid or does not exist
 */
declare type StorageUpdateStrategy = <T = any>(key: string) => Promise<T>;

interface StorageSyncAdapter {
    /**
     * in storage get data
     * @param key
     * @return T
     */
    getStorageSync: <T = any>(key: string) => T;
    /**
     * set data to storage
     * @param key
     * @param data
     * @param options
     * @return void
     */
    setStorageSync: (key: string, data: object | string | boolean | number, options?: PersistenceStorageOptions) => void;
    /**
     * remove key by local storage
     * @param key
     * @return  string[] | void
     */
    removeStorageSync: (key: string | string[]) => string | string[] | void;
}
/**
 * local storage adapter
 */
interface StorageAdapter extends Partial<StorageSyncAdapter> {
    /**
     * in storage get data
     * @param key
     * @param options
     * @return Promise<T>
     */
    getStorage: <T = any>(key: string, options?: GetStorageOptions | true | StorageUpdateStrategy) => Promise<T>;
    /**
     * set data to storage
     * @param key
     * @param data
     * @param options      if it is a number, it means that you need to set the effective time of saving.
     * @return Promise<void>
     */
    setStorage: (key: string, data: object | string | boolean | number, options?: number | PersistenceStorageOptions) => Promise<void> | void;
    /**
     * remove key by local storage
     * @param key
     * @return Promise<string[]> return removed keys
     */
    removeStorage: (key: string | string[]) => Promise<string | string[]> | void;
    /**
     * get all keys
     */
    getKeys?: () => Promise<string[]>;
    /**
     * clear all keys
     */
    clearAll?: () => Promise<void> | void;
}
interface PersistenceStorageOptions {
    /**
     * storage effective times，
     */
    effectiveTime: number;
}
interface GetStorageOptions {
    /**
     * 当数据无效的时候刷新
     */
    onInvalidRefresh?: boolean;
    /**
     * 当获取数据失败的时候刷新
     */
    onRejectRefresh?: boolean;
}

declare type SetStorageCommandMethod<T> = (data?: T, options?: number | PersistenceStorageOptions) => Promise<void>;
declare type SetStorageCommandMethodSync<T> = (data?: T, options?: number | PersistenceStorageOptions) => void;
declare type GetStorageCommandMethod<T = any> = (options?: GetStorageOptions | true | StorageUpdateStrategy) => Promise<T>;
declare type GetStorageCommandMethodSync<T = any> = (options?: GetStorageOptions | true | StorageUpdateStrategy) => T;
declare type RemoveStorageCommandMethod = () => Promise<void>;
declare type RemoveStorageCommandMethodSync = () => void;
/**
 * app command storage
 */
interface AppCommandStorage extends StorageAdapter {
}

interface StorageCommandConfiguration {
    storageAdapter: () => StorageAdapter;
    methodNameCommandResolver?: () => MethodNameCommandResolver;
    storageUpdateStrategy?: () => StorageUpdateStrategy;
}

/**
 * app command storage factory
 * @param configuration
 * @param pathPrefix
 */
declare const appCommandStorageFactory: <T extends AppCommandStorage, N extends StorageAdapter = StorageAdapter>(configuration: StorageCommandConfiguration, pathPrefix?: string) => T & N;

interface StorageItem {
    data: any;
    __localStorageOptions__: {
        effectiveTime: number;
        lastUpdateTime: number;
    };
}
/**
 * default wrapper storage adapter
 */
declare class DefaultWrapperStorageAdapter implements StorageAdapter {
    protected storageAdapter: StorageAdapter;
    protected prefix: string;
    protected storageUpdateStrategy: StorageUpdateStrategy;
    constructor(storageAdapter: StorageAdapter, prefix?: string, storageUpdateStrategy?: StorageUpdateStrategy);
    clearAll: () => void | Promise<void>;
    getKeys: () => Promise<string[]>;
    setStorage: (key: string, data: object | string | boolean | number, options?: PersistenceStorageOptions) => void | Promise<void>;
    getStorage: <T>(key: string, options?: GetStorageOptions | true | StorageUpdateStrategy) => Promise<any>;
    removeStorage: (key: (string | string[])) => any;
    protected genKey: (key: string) => string;
    protected getSaveItem(data: object | string | boolean | number, options: PersistenceStorageOptions): StorageItem;
    /**
     * 数据是否有效
     * @param expireDate
     */
    protected isItEffective: ({ effectiveTime, lastUpdateTime }: {
        effectiveTime: any;
        lastUpdateTime: any;
    }) => boolean;
    /**
     * 更新数据
     * @param error
     * @param key
     * @param options
     * @param localStorageOptions
     */
    protected updateStorageItem: (error: any, key: string, options: GetStorageOptions | true | StorageUpdateStrategy, localStorageOptions: {
        effectiveTime: number;
        lastUpdateTime: number;
    }) => Promise<any>;
}

/**
 * storage command
 */
declare enum StorageCommand {
    SET = "set",
    GET = "get",
    REMOVE = "remove",
    CLEAR = "clear"
}

export { AppCommandStorage, DefaultWrapperStorageAdapter, GetStorageCommandMethod, GetStorageCommandMethodSync, GetStorageOptions, PersistenceStorageOptions, RemoveStorageCommandMethod, RemoveStorageCommandMethodSync, SetStorageCommandMethod, SetStorageCommandMethodSync, StorageAdapter, StorageCommand, StorageSyncAdapter, StorageUpdateStrategy, appCommandStorageFactory };
