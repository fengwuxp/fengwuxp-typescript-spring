/**
 * sync local storage adapter
 */
import {StorageUpdateStrategy} from "./StorageUpdateStrategy";

export interface StorageSyncAdapter {
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
export interface StorageAdapter extends Partial<StorageSyncAdapter> {


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


export interface PersistenceStorageOptions {

    /**
     * storage effective times，
     */
    effectiveTime: number;
}


export interface GetStorageOptions {

    /**
     * 当数据无效的时候刷新
     */
    onInvalidRefresh?: boolean;

    /**
     * 当获取数据失败的时候刷新
     */
    onRejectRefresh?: boolean;
}
