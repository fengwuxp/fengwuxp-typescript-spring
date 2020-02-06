import * as log4js from "log4js";

import {reduceRightCommandResolvers, toLineResolver, toUpperCaseResolver} from "fengwuxp-declarative-command";
import {
    AppCommandStorage,
    GetStorageCommandMethod, GetStorageCommandMethodSync,
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
    getMaxWaitTimesSync: GetStorageCommandMethodSync<number>;

    removeMaxWaitTimes: RemoveStorageCommandMethod;

}

describe("test  app command storage factory", () => {


    let mockStorage = {};
    // let mockStorage = {};


    const mockAppStorage = appCommandStorageFactory<MockAppCommandStorage>({
        methodNameCommandResolver: function () {
            return reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver);
        },

        // @ts-ignore
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

                    let mockStorageElement = this.getStorageSync(key);
                    if (mockStorageElement == null) {
                        return Promise.reject();
                    }
                    return Promise.resolve(mockStorageElement);
                },

                removeStorage: function (key: string | string[]): Promise<string[]> {
                    return Promise.resolve(this.removeStorageSync(key));
                },

                setStorage: function (key: string, data: object | string | boolean | number, options: number | PersistenceStorageOptions) {
                    this.setStorageSync(key, data, options);
                },

                getStorageSync: function (key: string) {
                    logger.debug("获取数据", key);
                    return mockStorage[key];
                },

                removeStorageSync: function (key: string | string[]) {
                    logger.debug("移除数据", key);
                    delete mockStorage[key as string];
                    return [key];
                },

                setStorageSync: function (key: string, data: object | string | boolean | number, options: PersistenceStorageOptions) {
                    logger.debug("保存数据", key, data);
                    mockStorage[key] = data;
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
        const maxWaitTimesSync = mockAppStorage.getMaxWaitTimesSync();
        logger.debug("maxWaitTimes", maxWaitTimes, maxWaitTimesSync);
    }, 2 * 1000);

});
