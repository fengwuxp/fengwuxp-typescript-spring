
#### typescript feign 实现

- [feign](./feign)
- [feign-boot-starter](./feign-boot) 提供简易的初始化配置

##### typescript feign boot starter
- [feign-browser-boot](./feign-borswer-boot)                 提供浏览器的初始化配置
- [feign-nodejs-boot](./feign-nodejs-boot)                   提供nodejs的初始化配置
- [feign-tarojs-boot](./feign-tarojs-boot)                   提供tarojs的初始化配置
- [feign-weex-boot](./feign-weex-boot)                       提供weex的初始化配置
- [feign-react-native-boot](./feign-react-native-boot)       提供react-native的初始化配置

#### feign 集成（基于webpack打包）
- [typescript中文网](https://www.tslang.cn/docs/home.html)
- 需要的依赖
```
  typescript的依赖：
    "typescript": "^3.7.2"

  feign starter的依赖，按照不同的js环境：
    nodejs: "feign-boot-nodejs-stater":"^1.0.0"                   yarn add feign-boot-nodejs-stater or npm i feign-boot-nodejs-stater
    browser(浏览器): "feign-boot-browser-stater":"^1.0.0"          yarn add feign-boot-browser-stater or npm i feign-boot-browser-stater
    react-native: "feign-boot-react-native-stater":"^1.0.0"                    yarn add feign-boot-react-native-stater or npm i feign-boot-react-native-stater

  由于生成的sdk源文件是ts,所以需要增加ts-loader，可以使用 awesome-typescript-loader或ts-loader  
  webpack配置：

      {
              test: /\.ts[x]?$/,
           // exclude: isExclude,
               use: [
                  // 链式调用
                   {
                             loader: "babel-loader",
                             //options: babel7Options
                  },
                  {
     
                       loader: "awesome-typescript-loader",
                       options: {
                               useCache: true
                            }
                         }
                     ]
        },

```
- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)
- [ts-loader](https://github.com/TypeStrong/ts-loader)
- 在项目下增加tsconfig.json文件
- 项目配置，参考[RegisterBrowserOpenFeign](https://github.com/fengwuxp/fengwuxp-typescript-spring/blob/master/templates/umi-antd-v4-template/src/RegisterBrowserOpenFeign.ts)
