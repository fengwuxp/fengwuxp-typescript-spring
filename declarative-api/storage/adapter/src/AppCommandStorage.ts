import {GetStorageOptions, PersistenceStorageOptions, StorageAdapter} from "./StorageAdapter";
import {StorageUpdateStrategy} from "./StorageUpdateStrategy";


export type SetStorageCommandMethod<T> = (data?: T, options?: number | PersistenceStorageOptions) => Promise<void>;
export type SetStorageCommandMethodSync<T> = (data?: T, options?: number | PersistenceStorageOptions) => void;

export type GetStorageCommandMethod<T = any> = (options?: GetStorageOptions | true | StorageUpdateStrategy) => Promise<T>;
export type GetStorageCommandMethodSync<T = any> = (options?: GetStorageOptions | true | StorageUpdateStrategy) => T;

export type RemoveStorageCommandMethod = () => Promise<void>;
export type RemoveStorageCommandMethodSync = () => void;


/**
 * app command storage
 */
export interface AppCommandStorage extends StorageAdapter {

    /**
     *  key   ==> {@code key} route 路径
     *  value ==> command method
     *  example :
     */
    // [key: string]: PersistenceStorageCommandMethod | GetStorageCommandMethod;

}
