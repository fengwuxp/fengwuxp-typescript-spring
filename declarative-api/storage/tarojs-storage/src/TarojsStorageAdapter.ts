import {
    GetStorageOptions,
    PersistenceStorageOptions,
    StorageAdapter,
    StorageSyncAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";
import * as Taro from "@tarojs/taro";


/**
 * tarojs storage adapter
 */
export default class TarojsStorageAdapter implements StorageAdapter, StorageSyncAdapter {


    constructor() {
    }

    clearAll = () => {
        return Taro.clearStorage().then(() => undefined);
    };

    getKeys = () => {
        return Promise.reject('not support');
    };

    getStorage = <T = string>(key: string, options?: (GetStorageOptions | true | StorageUpdateStrategy)): Promise<T> => {
        return Taro.getStorage({
            key
        }).then(({data}: any) => {
            return data as any;
        })
    };

    removeStorage = (key: (string | string[])) => {

        return Taro.removeStorage({key: key as string}) as any;
    };

    setStorage = (key: string, data: string, options?: (number | PersistenceStorageOptions)) => {

        return Taro.setStorage({
            key,
            data
        }) as any;
    };

    getStorageSync = <T = any>(key: string) => {
        return Taro.getStorageSync(key);
    };

    removeStorageSync = (key: (string | string[])) => {
        return Taro.removeStorageSync(key as string);
    };

    setStorageSync = (key: string, data: (object | string | boolean | number), options?: PersistenceStorageOptions) => {
        return Taro.setStorageSync(key, data);
    };


}
