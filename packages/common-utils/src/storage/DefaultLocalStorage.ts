import {LocalStorage, LocalStorageOptions} from "./LocalStorage";
import StringUtils from "../string/StringUtils";


/**
 * 默认的LocalStorage的实现
 */
export default class DefaultLocalStorage implements LocalStorage {

    public static LOCAL_STORAGE_OPTIONS_NAME = "_localStorageOptions_";

    protected storage: LocalStorage;


    constructor(storage: LocalStorage) {
        this.storage = storage;
    }

    getKeys = () => this.storage.getKeys();

    getStorage = <T>(key: string): Promise<T> => {
        return this.storage.getStorage<string>(key).then((data) => {
            if (data == null) {
                return Promise.reject(null);
            }
            if (!StringUtils.isJSONString(data)) {
                return data as any;
            }
            const object = JSON.parse(data);

            if (DefaultLocalStorage.LOCAL_STORAGE_OPTIONS_NAME in object) {
                //如果存在配置
                if (this.isItEffective(object[DefaultLocalStorage.LOCAL_STORAGE_OPTIONS_NAME].expireDate)) {
                    return object.data;
                } else {
                    return Promise.reject(null);
                }

            }
            return object as T;
        });
    };

    removeStorage = (key: string | string[]): Promise<string[]> => this.storage.removeStorage(key);

    setStorage = <T>(key: string, data: T, options?: LocalStorageOptions): Promise<void> => {

        let d: any;
        if (options) {
            d = {
                data: d,
                [DefaultLocalStorage.LOCAL_STORAGE_OPTIONS_NAME]: {
                    expireDate: options.effectiveTime + new Date().getTime()
                }
            };
        } else {
            d = data;
        }
        return this.storage.setStorage<string>(key, typeof data === "string" ? d : JSON.stringify(d));
    };


    /**
     * 数据是否有效
     * @param expireDate
     */
    protected isItEffective = (expireDate: number) => {

        return new Date().getTime() > expireDate;
    }

}