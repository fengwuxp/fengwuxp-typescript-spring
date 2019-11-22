/**
 * Update strategy when data in storage fails
 */
export type StorageUpdateStrategy=(key:string)=>Promise<any>
