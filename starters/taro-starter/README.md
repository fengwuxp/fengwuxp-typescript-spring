
#### 因为taro 加载第三方模块的问题，在这个模块中聚合所有自定义的
模块，统一导出


#### 导出模块

      1：Feign                        代理相关，具体参考 common_fetch

      2: TaroLocalStorage            这是一个统一抽象LocalStorage的Taro实现

      3: taroDefaultSessionManager   默认的会话管理器 基于TaroLocalStorage的实现

      3: TaroNavigatorAdapter        提供和浏览器一直的Api