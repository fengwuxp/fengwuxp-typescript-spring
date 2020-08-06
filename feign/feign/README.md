#### 设计
```
  1；通过自定义装饰器和动态代理实现。
  2：通过抽象HttpAdapter解耦不同的js运行环境，通过RestTemplate规范请求。
  3：通过拦截器增强在请求时由于业务或者场景需要的动态需求。
  4：通过签名策略加强接口安全信息
  5：通过接口模块路由映射,支持项目中访问不同域名（业务模块）的接口
```

#### 功能
- 支持所有的js环境 (不同环境需要实现不同的适配器，参见:src/adapter/HttpAdapter.ts)
- 提供拦截器能力
- 支持网络检查
- 支持统一请求和响应处理（通过拦截器实现）
- 支持鉴权（src/client/AuthenticationClientHttpRequestInterceptor.ts）
- 支持项目中访问不同的模块或第三方的接口 （src/client/RoutingClientHttpRequestInterceptor.ts）
- 支持接口签名 (src/signature/ApiSignatureStrategy.ts)
- 支持文件上传（src/upload）
- 支持数据装换（src/codec/CodecFeignClientExecutorInterceptor.ts）

#### 思路
          1：请求统一由client发出
          2: client有一个请求适配器进行真正的处理，已对应不同环境，比如浏览器，Nodejs weex 微信小程序，react-native
             默认已经实现了 浏览器，weex,微信小程序3个端
          3：请求过程可以插入前置、后置拦截器
          4：通过encoder 和 decoder 可以进行复杂的数据处理，比如文件上传，请求和响应数据的混淆


#### 配置
- 配置将会被缓存，以保证实现了FeignConfiguration接口的类中的方法只会被调用一次，同一个FeignConfiguration的子类只会被实例化一次

      
#### 支持数据混淆
- 请求数据混淆
- 响应数据混淆     

#### 提交前验证
- [async-validator](https://github.com/yiminghe/async-validator) 

##### 使用方式 (参见 test)

          1: http adpater
               不同的平台的的http请求工具

          2: http client
               屏蔽了平台的差异化


          3: rest template
               (1)：固化了一系列的请求相关的内容 例如 超时时间定定义，统一拦截，统一异常处理
               (2)：支持多个模块的路由

          4 feign prroxy

               以接口代理的形式屏蔽远程调用的感知，调用时就如同使用本地方法一样

          5  annotation

                注解增强：

                Feign：标记一个类为Feign代理

                RequestMapping相关注解：标记在上方法

                //接口签名注解
                Signature: 可以标记那些参数需要加入签名

                //接口重试
                FetchRetry


                注解除了RequestMapping 外 还可以增加 CachePut, Task等 来管理本地缓存以及定时作业
                还可以考虑增加注解直接把请求下来的数据加入状态管理器中 例如redux
           
           6  encoder和 file upload
                 
                 在代理中加入统一文件上传逻辑，可以在请求参数中直接传入File对象或base64字符串，使用ProxyUnifiedTransformRequestFileObjectEncoder
                 可以自动上传文件，并自动覆盖参数。
                    
                    例如有一个商品评价接口，需要上传图片，一般的做法是先上传图片得到url，然后和评价内容一起提交，或者是使用表单将文件和数据一起提交
                   
                    第一种做法可能会重复上传很多无效的图片，而且开发的时候要先处理图片上传的逻辑 比较繁琐。
                    
                    第二种做法服务端要做额外的处理(比如统一拦截处理，或每个接口单独处理)，这里就不赘述了。
                    
                    然而使用上述的统一处理，既可以简化开发人员的逻辑处理，有可用保证不会上传太多的无效的图片（默认情况上传策略会缓存上传结果，尽量减少重复上传的可能），
                    服务也只需要提供一个统一上传的服务就好了，在很多场景可用简化开发流程，提高开发效率。
                    
# [rollup](https://www.rollupjs.com/)
