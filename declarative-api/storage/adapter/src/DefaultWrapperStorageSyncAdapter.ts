import DefaultWrapperStorageAdapter from "./DefaultWrapperStorageAdapter";
import {PersistenceStorageOptions, StorageAdapter, StorageSyncAdapter} from "./StorageAdapter";


/**
 * default wrapper storage sync adapter
 */
export class DefaultWrapperStorageSyncAdapter extends DefaultWrapperStorageAdapter implements StorageSyncAdapter {


    constructor(storageAdapter: StorageAdapter, prefix: string, storageUpdateStrategy: <T = any>(key: string) => Promise<T>) {
        super(storageAdapter, prefix, storageUpdateStrategy);
    }

    getStorageSync = <T = any>(key: string) => {

        // 同步获取不支持更新策略

        const data = this.storageAdapter.getStorageSync(key);
        if (data == null) {
            // data is null or undefined
            return null;
        }
        let object: any;
        if (typeof data === "string") {
            object = JSON.parse(data);
        } else {
            object = data as any;
        }

        // 数据有效
        const localStorageOptions = object.__localStorageOptions__;
        if (this.isItEffective(localStorageOptions)) {
            return object.data;
        }

        return data;
    };

    removeStorageSync = (key: (string | string[])) => {
        if (Array.isArray(key)) {
            return key.map(this.removeStorageSync);
        } else {
            return this.storageAdapter.removeStorageSync(this.genKey(key));
        }
    };

    setStorageSync = (key: string, data: (object | string | boolean | number), options?: PersistenceStorageOptions) => {
        // 保存配置项
        return this.storageAdapter.setStorageSync(this.genKey(key), this.getSaveItem(data, options));
    };


}
