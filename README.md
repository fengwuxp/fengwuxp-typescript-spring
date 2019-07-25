

#### spring typescript 版本
- 目录结构说明
```
-boot                      spring-boot
-framework                 spring-framework
-packages                  通用的模块
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