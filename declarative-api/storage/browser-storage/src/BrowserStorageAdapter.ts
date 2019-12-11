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
        const item = this.storage.getItem(key);
        if (item == null) {
            return Promise.reject();
        }
        return Promise.resolve(item as any);
    };

    removeStorage = (key: (string | string[])) => {

        this.storage.removeItem(key as string);
        return Promise.resolve(key);
    };

    setStorage = (key: string, data: string, options?: (number | PersistenceStorageOptions)) => {

        return this.storage.setItem(key, data);
    }


}
