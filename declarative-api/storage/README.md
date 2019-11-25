

#### 声明式本地存储
- 统一抽象本地存储抽象
- 提供声明式Api
```
   // 声明应用storage接口
  interface MockAppCommandStorage extends AppCommandStorage {

    setMaxWaitTimes: SetStorageCommandMethod<number>;

    getMaxWaitTimes: GetStorageCommandMethod<number>;

    removeMaxWaitTimes: RemoveStorageCommandMethod;

  }
  
   // 创建应用storage
   const mockAppStorage = appCommandStorageFactory<MockAppCommandStorage>({
   
   })
   
   // 使用
   await mockAppStorage.setMaxWaitTimes(100);
   let maxWaitTimes = await mockAppStorage.getMaxWaitTimes();
   logger.debug("maxWaitTimes", maxWaitTimes);
   let keys = await mockAppStorage.getKeys();
   logger.debug("keys", keys);
   mockAppStorage.removeMaxWaitTimes();
   maxWaitTimes = await mockAppStorage.getMaxWaitTimes(true);
   maxWaitTimes = await mockAppStorage.getMaxWaitTimes(true);
   logger.debug("maxWaitTimes", maxWaitTimes);
  
```
