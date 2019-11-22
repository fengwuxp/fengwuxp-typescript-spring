/**
 * local storage adapter
 */
export interface StorageAdapter {


    /**
     * in storage get data
     * @param key
     * @return Promise<T>
     */
    getStorage: <T>(key: string) => Promise<T>;

    /**
     * set data to storage
     * @param key
     * @param data
     * @param options
     * @return Promise<void>
     */
    setStorage: <T>(key: string, data: T, options?: StorageOptions) => Promise<void> | void;


    /**
     * remove key by local storage
     * @param key
     * @return Promise<string[]> return removed keys
     */
    removeStorage: (key: string | string[]) => Promise<string[]> | string[] | void;

    /**
     * get all keys
     */
    getKeys?: () => Promise<string[]> | string[] | void;

    /**
     * clear all keys
     */
    clearAll?: () => Promise<void> | void;


}

export interface StorageOptions {

    /**
     * storage effective times，
     */
    effectiveTime: number;
}
