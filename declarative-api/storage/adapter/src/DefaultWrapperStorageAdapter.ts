import {StorageAdapter, StorageOptions} from "./StorageAdapter";


/**
 * default wrapper storage adapter
 */
export default class DefaultWrapperStorageAdapter implements StorageAdapter {

    private storageAdapter: StorageAdapter;

    private prefix: string;

    constructor(storageAdapter: StorageAdapter, prefix: string) {
        this.storageAdapter = storageAdapter;
        this.prefix = prefix || "";
    }

    clearAll = () => {
        return this.storageAdapter.clearAll();
    };
    getKey = () => {
        return this.storageAdapter.getKeys();
    };

    setStorage = <T>(key: string, data: T, options?: StorageOptions) => {

        // TODO 保存配置项

        return this.storageAdapter.setStorage(this.genKey(key), data, options);
    };

    getStorage = <T>(key: string) => {

        //TODO 如果存在配置项，则进行验证，例如过期时间
        //TODO 尝试使用更新策略，自动更新数据

        return this.getStorage(this.genKey(key));
    };

    removeStorage = (key: (string | string[])) => {

        if (Array.isArray(key)) {

        } else {
            return this.storageAdapter.removeStorage(this.genKey(key));
        }

    };


    private genKey = (key: string) => {
        if (key.startsWith(this.prefix)) {
            return key;
        }
        return `${this.prefix}${key}`
    }


}
