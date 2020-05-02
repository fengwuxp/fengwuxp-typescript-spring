import {
    AppCommandStorage,
    GetStorageCommandMethod,
    GetStorageCommandMethodSync,
    RemoveStorageCommandMethod,
    SetStorageCommandMethod
} from 'fengwuxp-declarative-storage-adapter'
import {browserAppCommandStorageFactory} from 'fengwuxp-browser-storage'
import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";


export interface BrowserAppStorage extends AppCommandStorage {

  setUserInfo: SetStorageCommandMethod<LoginUserInfo>

  getUserInfo: GetStorageCommandMethod<LoginUserInfo>

  getUserInfoSync: GetStorageCommandMethodSync<LoginUserInfo>

  removeUserInfo: RemoveStorageCommandMethod

}

export const AppStorage = browserAppCommandStorageFactory<BrowserAppStorage>();
