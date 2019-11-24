import * as log4js from "log4js";

import {reduceRightCommandResolvers, toLineResolver, toUpperCaseResolver} from "fengwuxp-declarative-command";
import {
    AppCommandStorage,
    GetStorageCommandMethod,
    RemoveStorageCommandMethod,
    SetStorageCommandMethod
} from "../src/AppCommandStorage";
import {appCommandStorageFactory} from "../src/AppCommandStorageFactory";
import {GetStorageOptions, PersistenceStorageOptions} from "../src/StorageAdapter";
import {StorageUpdateStrategy} from "../src/StorageUpdateStrategy";


const logger = log4js.getLogger();
logger.level = 'debug';


interface MockAppCommandStorage extends AppCommandStorage {

    setMaxWaitTimes: SetStorageCommandMethod<number>;

    getMaxWaitTimes: GetStorageCommandMethod<number>;

    removeMaxWaitTimes: RemoveStorageCommandMethod;

}

describe("test  app command storage factory", () => {


    let mockStorage = {};
    // let mockStorage = {};

    const mockAppStorage = appCommandStorageFactory<MockAppCommandStorage>({
        methodNameCommandResolver: function () {
            return reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver);
        },
        storageAdapter: function () {

            return {

                clearAll: function () {
                    mockStorage = {};
                    return;
                },

                getKeys: function () {
                    const keys = Object.keys(mockStorage);
                    return Promise.resolve(keys);
                },

                getStorage: function (key: string, options: GetStorageOptions | true | StorageUpdateStrategy) {
                    logger.debug("获取数据", key);
                    let mockStorageElement = mockStorage[key];
                    if (mockStorageElement == null) {
                        return Promise.reject();
                    }
                    return Promise.resolve(mockStorageElement);
                },

                removeStorage: function (key: string | string[]): Promise<string[]> {
                    logger.debug("移除数据", key);
                    delete mockStorage[key as string];
                    return Promise.resolve(key as string[]);
                },

                setStorage: function (key: string, data: object | string | boolean | number, options: number | PersistenceStorageOptions) {
                    logger.debug("保存数据", key, data);
                    mockStorage[key] = data;
                    return;
                }

            };
        },
        storageUpdateStrategy: function () {
            return (key): Promise<any> => {
                console.log("刷新数据");
                return Promise.resolve(1);
            };
        }

    });


    test("test mock app storage", async () => {

        await mockAppStorage.setMaxWaitTimes(100);
        let maxWaitTimes = await mockAppStorage.getMaxWaitTimes();
        logger.debug("maxWaitTimes", maxWaitTimes);
        let keys = await mockAppStorage.getKeys();
        logger.debug("keys", keys);
        mockAppStorage.removeMaxWaitTimes();
         maxWaitTimes = await mockAppStorage.getMaxWaitTimes(true);
        maxWaitTimes = await mockAppStorage.getMaxWaitTimes(true);
        logger.debug("maxWaitTimes", maxWaitTimes);
    }, 2 * 1000);

});
