/**
 * update policy when data in the store is invalid or does not exist
 */
export type StorageUpdateStrategy = <T=any>(key: string) => Promise<T>


