

#### spring typescript 版本
- 目录结构说明
```
- alibaba-cloud                           阿里云相关，例如：oss
- babel-plugins                           babel插件
- declarative-api                         指令式api（声明式），例如：路由、存储、事件广播
- dependency-management                   管理一些常见的衣领
- feign                                   feign代理
- framework                               参考spring思路的一些代码生成（为完成），以及spel的实现 
- log4j                                   日志
- packages                                通用的工具、代理等实现
- routing                                 页面路由相关的抽象和实现
- spring-security
- starters                                启动器
- templates                               一些项目模板
- websocket                               websocket的抽象

```
- 实现目标
```
  参照java spring框架思路实现一个typescript版本的
```

- 实现方式
```
  由于js和java运行机制和语言特性的差别，spring核心的依赖注入和控制反转实现需要依赖typescript在打包为js时候做处理，即编译时处理
  
  1: 通过自定义注解（装饰器）标记类。
  2：编译时根据配置扫描文件，将符号扫描规则的文件抓取出来。
  3：分析Bean之间依赖关系，决定初始化的顺序（Bean定义和Bean工厂）
  4：在一个类被使用时进行初始化和注入（Bean Scope）
  5：Bean销毁
  ...
   
```
支持所有 js 环境的 http 请求库 typescript-feign，附带 sdk 生成工具 common-codegen