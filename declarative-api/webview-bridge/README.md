

#### 桥接webview和原生端
- react-native
- 小程序

#### 设计思路
- 通过消息机制进行调用
```
  消息格式
  {
     // 消息ID
     id:number,
     // 模块名称
     moduleName:string,
     // 函数名称
     functionName:string,
     // 参数
     args:any
  }

```
- 原生js端提供模块注册的方式，以提供给浏览器使用
