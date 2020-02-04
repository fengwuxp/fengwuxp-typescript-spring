import {
    AppCommandStorage,
    GetStorageCommandMethod,
    RemoveStorageCommandMethod,
    SetStorageCommandMethod,
} from 'fengwuxp-declarative-storage-adapter'
import { browserAppCommandStorageFactory } from 'fengwuxp-browser-storage'


export interface BrowserAppStorage extends AppCommandStorage {
    setUserInfo: SetStorageCommandMethod<any>
    getUserInfo: GetStorageCommandMethod<any>
    removeUserInfo: RemoveStorageCommandMethod

}

export const AppStorage = browserAppCommandStorageFactory<BrowserAppStorage>()
