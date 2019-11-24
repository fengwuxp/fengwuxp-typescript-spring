import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * update policy when data in the store is invalid or does not exist
 */
declare type StorageUpdateStrategy = <T = any>(key: string) => Promise<T>;

/**
 * local storage adapter
 */
interface StorageAdapter {
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
declare type GetStorageCommandMethod<T = any> = (options?: GetStorageOptions | true | StorageUpdateStrategy) => Promise<T>;
declare type RemoveStorageCommandMethod = () => Promise<void>;
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

/**
 * default wrapper storage adapter
 */
declare class DefaultWrapperStorageAdapter implements StorageAdapter {
    private storageAdapter;
    private prefix;
    private storageUpdateStrategy;
    constructor(storageAdapter: StorageAdapter, prefix?: string, storageUpdateStrategy?: StorageUpdateStrategy);
    clearAll: () => void | Promise<void>;
    getKeys: () => Promise<string[]>;
    setStorage: (key: string, data: string | number | boolean | object, options?: PersistenceStorageOptions) => void | Promise<void>;
    getStorage: <T>(key: string, options?: true | GetStorageOptions | StorageUpdateStrategy) => Promise<any>;
    removeStorage: (key: string | string[]) => any;
    private genKey;
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
    private updateStorageItem;
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

export { AppCommandStorage, DefaultWrapperStorageAdapter, GetStorageCommandMethod, GetStorageOptions, PersistenceStorageOptions, RemoveStorageCommandMethod, SetStorageCommandMethod, StorageAdapter, StorageCommand, StorageUpdateStrategy, appCommandStorageFactory };
