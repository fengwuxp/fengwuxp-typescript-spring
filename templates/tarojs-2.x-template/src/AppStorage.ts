import {
  AppCommandStorage,
  GetStorageCommandMethod,
  RemoveStorageCommandMethod,
  SetStorageCommandMethod
} from 'fengwuxp-declarative-storage-adapter'
import {tarojsAppCommandStorageFactory} from 'fengwuxp-torojs-storage'


export interface AppStorage extends AppCommandStorage {

  setMemberInfo: SetStorageCommandMethod<any>;

  getMemberInfo: GetStorageCommandMethod<any>;

  removeMemberInfo: RemoveStorageCommandMethod;


}

export const AppStorage = tarojsAppCommandStorageFactory<AppStorage>();
