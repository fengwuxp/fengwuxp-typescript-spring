import {
    GetStorageOptions,
    PersistenceStorageOptions,
    StorageAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";


/**
 * browser storage adapter
 */
export default class BrowserStorageAdapter implements StorageAdapter {


    private storage: Storage;

    constructor(storage: Storage = localStorage) {
        this.storage = storage;
    }

    clearAll = () => {
        return this.storage.clear()
    };

    getKeys = () => {
        return Promise.reject('not support');
    };

    getStorage = <T = string>(key: string, options?: (GetStorageOptions | true | StorageUpdateStrategy)): Promise<T> => {
        const item = this.getStorageSync(key);
        if (item == null) {
            return Promise.reject();
        }
        return Promise.resolve(item);
    };

    removeStorage = (key: (string | string[])) => {
        this.removeStorageSync(key);
        return Promise.resolve(key as string);
    };

    setStorage = (key: string, data: string, options?: (number | PersistenceStorageOptions)) => {

        return this.setStorageSync(key, data);
    };

    getStorageSync = <T = any>(key: string) => {
        return this.storage.getItem(key) as any;
    };

    removeStorageSync = (key: (string | string[])) => {
        this.storage.removeItem(key as string);
    };

    setStorageSync = (key: string, data: (object | string | boolean | number), options?: PersistenceStorageOptions) => {
        return this.storage.setItem(key, data as any);
    };


}
