import {LocalStorage, LocalStorageOptions} from "../LocalStorage";
import DefaultLocalStorage from "../DefaultLocalStorage";

/**
 * browser local storage
 */
class BrowserLocalStorage implements LocalStorage {

    getKeys = () => {

        return Promise.reject(new Error("web not support keys method"));
    };

    getStorage = <T>(key: string): Promise<T> => {
        const item: T = localStorage.getItem(key) as any;
        return Promise.resolve(item);
    };

    removeStorage = (key: (string | string[])): Promise<string[]> => {

        if (typeof key == "string") {
            localStorage.removeItem(key);
            return Promise.resolve([key]);
        } else {
            key.forEach(localStorage.removeItem);
            return Promise.resolve(key);
        }


    };

    setStorage = <T>(key: string, data: T): Promise<void> => {

        localStorage.setItem(key, data as any);
        return Promise.resolve();
    };


}

export default new DefaultLocalStorage(new BrowserLocalStorage());