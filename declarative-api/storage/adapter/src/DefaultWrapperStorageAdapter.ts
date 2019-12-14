import {GetStorageOptions, PersistenceStorageOptions, StorageAdapter} from "./StorageAdapter";
import {StorageUpdateStrategy} from "./StorageUpdateStrategy";


interface StorageItem {

    data: any,
    __localStorageOptions__: {
        effectiveTime: number,
        lastUpdateTime: number
    }
}


enum StorageStatus {

    // NULL = "__N__",

    ERROR = "__E__",

    INVALID = "__I__"
}

//Never expire
const NEVER_EXPIRE = -1;

/**
 * default wrapper storage adapter
 */
export default class DefaultWrapperStorageAdapter implements StorageAdapter {


    protected storageAdapter: StorageAdapter;

    protected prefix: string;

    protected storageUpdateStrategy: StorageUpdateStrategy;

    constructor(storageAdapter: StorageAdapter,
                prefix?: string,
                storageUpdateStrategy?: StorageUpdateStrategy) {
        this.storageAdapter = storageAdapter;
        this.prefix = prefix || "";
        this.storageUpdateStrategy = storageUpdateStrategy;
    }


    clearAll = () => {
        return this.storageAdapter.clearAll();
    };


    getKeys = () => {
        return this.storageAdapter.getKeys();
    };

    setStorage = (key: string, data: object | string | boolean | number, options?: PersistenceStorageOptions) => {
        const object = this.getSaveItem(data, options);

        return this.storageAdapter.setStorage(this.genKey(key), JSON.stringify(object));
    };



    getStorage = <T>(key: string, options?: GetStorageOptions | true | StorageUpdateStrategy) => {

        // 如果存在配置项，则进行验证，例如过期时间
        // 尝试使用更新策略，自动更新数据
        return this.storageAdapter.getStorage<T>(key).then((data) => {
            if (data == null) {
                // data is null or undefined
                return Promise.reject();
            }
            let object: StorageItem;
            if (typeof data === "string") {
                object = JSON.parse(data);
            } else {
                object = data as any;
            }

            //数据有效
            const localStorageOptions = object.__localStorageOptions__;
            if (this.isItEffective(localStorageOptions)) {
                return object.data;
            }
            return this.updateStorageItem(StorageStatus.INVALID, key, options, localStorageOptions);
        }).catch((e) => {
            return this.updateStorageItem(e, key, options, undefined);
        })
    };

    removeStorage = (key: (string | string[])) => {

        if (Array.isArray(key)) {
            return Promise.all(key.map(this.removeStorage));
        } else {
            return this.storageAdapter.removeStorage(this.genKey(key));
        }
    };

    protected genKey = (key: string) => {
        if (key.startsWith(this.prefix)) {
            return key;
        }
        return `${this.prefix}${key}`
    };

    protected getSaveItem(data: object | string | boolean | number, options: PersistenceStorageOptions) {
        // 保存配置项
        const object: StorageItem = {
            data,
            __localStorageOptions__: {
                effectiveTime: options == null ? NEVER_EXPIRE : options.effectiveTime || NEVER_EXPIRE,
                lastUpdateTime: new Date().getTime()
            }
        };
        return object;
    }

    /**
     * 数据是否有效
     * @param expireDate
     */
    protected isItEffective = ({effectiveTime, lastUpdateTime}) => {
        if (effectiveTime == NEVER_EXPIRE) {
            return true;
        }
        return new Date().getTime() > (effectiveTime + lastUpdateTime);
    };

    /**
     * 更新数据
     * @param error
     * @param key
     * @param options
     * @param localStorageOptions
     */
    protected updateStorageItem = (error,
                                   key: string,
                                   options: GetStorageOptions | true | StorageUpdateStrategy,
                                   localStorageOptions: {
                                       effectiveTime: number,
                                       lastUpdateTime: number
                                   }) => {
        if (options == null) {
            return Promise.reject(error);
        }
        if (error === StorageStatus.ERROR) {
            return Promise.reject(`error`);
        }

        let refresh = false;
        let storageUpdateStrategy = this.storageUpdateStrategy;
        if (options === true) {
            refresh = true;
        } else if (typeof options === "function") {
            storageUpdateStrategy = options;
            refresh = true;
        } else if (typeof options === "function") {
            const {onInvalidRefresh, onRejectRefresh} = options;
            if (onInvalidRefresh) {
                refresh = error === StorageStatus.INVALID;
            } else if (onRejectRefresh) {
                refresh = true;
            }
        } else {

        }
        if (!refresh) {
            return Promise.reject(error);
        }

        if (storageUpdateStrategy == null) {
            console.log("storage update strategy is null");
            return Promise.reject(error);
        }
        //使用更新策略跟新
        return storageUpdateStrategy(key).then((data) => {
            this.setStorage(key, data, localStorageOptions);
            return data;
        });
    }


}
