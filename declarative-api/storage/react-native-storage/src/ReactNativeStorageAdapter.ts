import AsyncStorage from '@react-native-community/async-storage';
import {
    GetStorageOptions,
    PersistenceStorageOptions,
    StorageAdapter,
    StorageUpdateStrategy
} from "fengwuxp-declarative-storage-adapter";


export default class ReactNativeStorageAdapter implements StorageAdapter {

    clearAll = () => {
        return AsyncStorage.clear()
    };

    getKeys = () => {
        return AsyncStorage.getAllKeys()
    };

    getStorage = <T = string>(key: string, options?: (GetStorageOptions | true | StorageUpdateStrategy)): Promise<T> => {
        return AsyncStorage.getItem(key) as any;
    };

    removeStorage = (key: (string | string[])) => {

        return AsyncStorage.removeItem(key as string).then(() => {
            return key;
        });
    };

    setStorage = (key: string, data: string, options?: (number | PersistenceStorageOptions)) => {

        return AsyncStorage.setItem(key, data);
    }


}
