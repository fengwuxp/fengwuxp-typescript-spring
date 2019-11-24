import {MethodNameCommandResolver} from "fengwuxp-declarative-command";
import {StorageAdapter} from "./StorageAdapter";
import {StorageUpdateStrategy} from "./StorageUpdateStrategy";


export interface StorageCommandConfiguration {

    storageAdapter: () => StorageAdapter;

    methodNameCommandResolver?: () => MethodNameCommandResolver;

    storageUpdateStrategy?: () => StorageUpdateStrategy;

}
