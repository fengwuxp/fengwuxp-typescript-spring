/**
 * 对local storage的统一抽象
 */
export interface LocalStorage {


    /**
     * 获取storage的数据
     * @param key
     * @return Promise<T>
     */
    getStorage: <T>(key: string) => Promise<T>;

    /**
     * 设置到storage
     * @param key
     * @param data
     * @param options
     * @return Promise<void>
     */
    setStorage: <T>(key: string, data: T, options?: LocalStorageOptions) => Promise<void>;


    /**
     * 从storage 移除
     * @param key
     * @return Promise<string[]> 返回设置成功的keys
     */
    removeStorage: (key: string | string[]) => Promise<string[]>;

    /**
     * 获取keys列表
     */
    getKeys: () => Promise<string[]>


}

export interface LocalStorageOptions {

    /**
     * 有效，
     */
    effectiveTime: number;
}