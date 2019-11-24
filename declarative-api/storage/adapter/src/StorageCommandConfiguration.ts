import {MethodNameCommandResolver} from "fengwuxp-declarative-command";
import {StorageAdapter} from "./StorageAdapter";
import {StorageUpdateStrategy} from "./StorageUpdateStrategy";


export interface StorageCommandConfiguration {

    methodNameCommandResolver: () => MethodNameCommandResolver;

    storageAdapter: () => StorageAdapter;

    storageUpdateStrategy?: () => StorageUpdateStrategy;

}
