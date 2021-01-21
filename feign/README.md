#### 介绍

- feign是一个基于声明式的跨平台的http请求框架
- 实现思路基本和[spring cloud openfeign](https://github.com/spring-cloud/spring-cloud-openfeign) 一致

#### 设计概览

- [HttpAdapter](./feign/src/adapter/HttpAdapter.ts) 定义了对http请求的基本动作，包括请求参数和响应，是支持跨平台的核心接口，不同的js运行时环境需要实现该适配器

```typescript
import {HttpRequest} from "../client/HttpRequest";
import {HttpResponse} from "../client/HttpResponse";


/**
 * http request adapter
 *
 * different http clients can be implemented according to different java script runtime environments.
 *
 * {@param T} T extends {@see HttpRequest} Implementers can expand according to different situations
 * {@see HttpResponse}
 */
export interface HttpAdapter<T extends HttpRequest = HttpRequest> {

    /**
     * send an http request to a remote server
     * @param req
     */
    send: (req: T) => Promise<HttpResponse>;
}
```

- [HttpClient](./feign/src/client/HttpClient.ts)，定义了对http method请求的支持，它依赖一个具体的HttpAdapter实现，才能使用，它本身也是一个HttpAdapter的子类
- [AbstractHttpClient](./feign/src/client/AbstractHttpClient.ts) HttpClient的抽象实现，需要一个HttpAdapter实现
- [DefaultHttpClient](./feign/src/client/DefaultHttpClient.ts) HttpClient的默认实现，提供了对常用的http
  method请求支持，支持[ClientHttpRequestInterceptor](./feign/src/client/ClientHttpRequestInterceptor.ts)
- [RetryHttpClient](./feign/src/client/RetryHttpClient.ts)
  在DefaultHttpClient的基础上增加了请求重试的支持，它将请求委托给一个HttpClient或HttpAdapter对象

##### RestOperations

-
参考[spring web client RestOperations](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-resttemplate)
- [RestOperations](./feign/src/template/RestOperations.ts)
  更进一步的请求抽象，默认实现[RestTemplate](./feign/src/template/RestTemplate.ts)

```typescript
    const defaultHttpClient = new DefaultHttpClient(new MockHttpAdapter("http://a.b.com/api"), HttpMediaType.FORM_DATA);

const restTemplate = new RestTemplate(defaultHttpClient);
const httpResponse = await restTemplate.getForObject(
    "http://a.b.com/member/{id}",
    [1],
    {}).then((data) => {
    logger.debug("data", data);
    return data
});
logger.debug("httpResponse", httpResponse); 
```

- [UriTemplateHandler](./feign/src/template/UriTemplateHandler.ts) 支持处理模板url，例如：

```typescript
  const result = defaultUriTemplateFunctionHandler("http://a.b.com/{module}/{id}?name=李四", {
    "module": "member",
    id: 1
});
// 结果：result ==> http://a.b.com/member/1?name=李四
```

- [ResponseExtractor](./feign/src/template/ResponseExtractor.ts)从响应中提取业务(自定义)
  需要的结果，默认实现[RestResponseExtractor](./feign/src/template/RestResponseExtractor.ts)
- [ResponseErrorHandler](./feign/src/template/ResponseErrorHandler.ts) 请求错误处理

#### 基于装饰器增强

- 命名占位符（模板命名参数），支持默认值设置

```
   使用大括号标记的模板内容，用于运行时使用参数进行动态替换，例如：
   模板：find_member/{id} 
   参数：{id:1}
   resulut：find_member/1
   
   默认值设置，例如：a_{name:defaultName} ==>{name:null} ==> a_defaultValue
   使用':'分隔默认值
```

- [Feign](./feign/src/annotations/Feign.ts) 标记一个类为http的请求Client
  参考[spring cloud openfeign](https://github.com/spring-cloud/spring-cloud-openfeign)
  ，并通过装饰器返回一个代理的FeignClient实现
- [RequestMapping](./feign/src/annotations/mapping/RequestMapping.ts)
  用于开发者定义http请求的细节，url\请求方法\Content-Type等，有多个重载的实现，例如：[GetMapping](./feign/src/annotations/mapping/GetMapping.ts)
- [RequestMappingOptions](./feign/src/annotations/mapping/Mapping.ts) ，支持配置url、请求方法、请求头、默认参数，content-type等,示例如下

```
   @PostMapping({
       value: "find_member/{name}",
       // 从参数中的memberId 替换掉占位符{memberId}，支持设置默认值
       headers: {myHeader: "tk_{memberId}", defaultValue: "{name:faker}"},
       // params: ["test=k"]
       // 设置默认的查询参数或者表单参数
       params: {test: 'k'},
       produces: [HttpMediaType.APPLICATION_JSON_UTF8]
   })
   findMember: (
        request: {
          name:string,  
          memberId:number
        },
   options?: FeignRequestOptions) => Promise<any>;
```

这是一个Typescript FeignClient的例子：

```typescript
@Feign({
    value: "/test",
    // url:"http://a.bc.cn/api",
})
export default class ExampleFeignClient {


    @GetMapping({
        value: "/example"
    })
    getExample: (request: {
        id: number,
        test: string,
        date: Date
    }, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: []})
    @RequestMapping({
        value: "//testQuery",
        method: HttpMethod.POST,
        headers: {}
    })
    @FeignRetry({
        retries: 5,
        delay: 2000,
        maxTimeout: 9 * 1000
    })
    testQuery: (evt: any, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["userName"]})
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"},
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    @ValidateSchema<FindMemberRequest>({
        memberId: {
            required: true,
            min: 1
        }
    })
    findMember: (
        request: FindMemberRequest,
        options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["memberId"]})
    @DeleteMapping({value: "delete_member/{memberId}", produces: [HttpMediaType.APPLICATION_JSON_UTF8]})
    deleteMember: (
        request: {
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<number>;
}

```

#### 拦截器

##### ClientHttpRequestInterceptor

- [ClientHttpRequestInterceptor](./feign/src/client/ClientHttpRequestInterceptor.ts) HttClient中执行的拦截器，仅支持在请求之前调用
- [NetworkClientHttpRequestInterceptor](./feign/src/network/NetworkClientHttpRequestInterceptor.ts) 用于在请求前检查网络状态
- [AuthenticationClientHttpRequestInterceptor](./feign/src/client/AuthenticationClientHttpRequestInterceptor.ts)
  用于在请求之前，将用户认证信息追加到请求中
- [RoutingClientHttpRequestInterceptor](./feign/src/client/RoutingClientHttpRequestInterceptor.ts) 将请求路由到不同的地址，例如：

```
  实例化一个 RoutingClientHttpRequestInterceptor：
  
  new RoutingClientHttpRequestInterceptor({memberModule:"http://test.a.b.com/member"})
  let url='@memberModule/find_member  
  通过替换 @memberModule，得到： 'http://test.a.b.com/member/find_member'
  而@memberModule可以通过@Feign({value:"memberModule"})拼接到url中
  
  RoutingClientHttpRequestInterceptor也支持默认策略例如：
 
  new RoutingClientHttpRequestInterceptor("http://test.a.b.com/member")
  let url='@default/find_member  
  通过替换 @default，得到： 'http://test.a.b.com/member/find_member'，
  基于这个可以实现一个项目中请求不同地址的服务端
```

##### FeignClientExecutorInterceptor

- [FeignClientExecutorInterceptor](./feign/src/FeignClientExecutorInterceptor.ts) 在代理的FeignClient中，分别在请求前、 请求后、请求出错时执行
- [ProcessBarExecutorInterceptor](./feign/src/ui/ProcessBarExecutorInterceptor.ts) 请求进度条的支持
- [CodecFeignClientExecutorInterceptor](./feign/src/codec/CodecFeignClientExecutorInterceptor.ts) 在请求之前和响应后对数据进行编解码
- [UnifiedFailureToastExecutorInterceptor](./feign/src/ui/UnifiedFailureToastExecutorInterceptor.ts)
  统一错误提示处理，包括对401的特殊处理，例如：跳转到登录页面
- [TraceRequestExecutorInterceptor](./feign/src/trace/TraceRequestExecutorInterceptor.ts) 请求追踪，可以用于打印输出请求日志等处理

#### codec

- [DateEncoder](./feign/src/codec/DateEncoder.ts)
  将请求参数的Date对象转换为时间戳或者自定义格式的实际字符串，参见：[DateConverter](./feign/src/codec/converter/DateConverter.ts)
- [AbstractRequestFileObjectEncoder](./feign/src/upload/AbstractRequestFileObjectEncoder.ts) 支持在请求之前将参数中的文件对象
  或者Blob对象上传到文件服务器，并转换成文件服务器返回的url，替换掉原有的参数
- [FileUploadStrategy](./feign/src/upload/FileUploadStrategy.ts) 文件上传策略接口，例如上传到oss或者自己搭建的文件服务器

#### 接口签名

- [Signature](./feign/src/annotations/security/Signature.ts) 用于标记参数中那些字段要参与签名，例如：

```
    @Signature({fields: ["userName"]})
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"},
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    findMember: (
        request: FindMemberRequest,
        options?: FeignRequestOptions) => Promise<any>;
```

- [ApiSignatureStrategy](./feign/src/signature/ApiSignatureStrategy.ts)，api签名策略接口，可以按需自行实现

#### 参数验证

- [ValidateSchema](./feign/src/annotations/validator/VailidatorSchema.ts)用于标记接口参数的验证规则

```
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"},
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    @ValidateSchema<FindMemberRequest>({
        memberId: {
            required: true,
            min: 1
        }
    })
    findMember: (
        request: FindMemberRequest,
        options?: FeignRequestOptions) => Promise<any>;
```

- 目前只支持 [async-validator](https://github.com/yiminghe/async-validator) 的规则

#### 数据混淆

- [DataObfuscation](./feign/src/annotations/security/DataObfuscation.ts) 用于标记参数中那些字段要参与数据混淆，例如：

```
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"},
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    @DataObfuscation<FindMemberRequest>({
      requestFields:['name'],
      responseFields:['name']
    })
    findMember: (
        request: FindMemberRequest,
        options?: FeignRequestOptions) => Promise<any>;
```

DataObfuscation 只是标记了需要混淆的字段，具体的实现需要使用自行实现，可以使用拦截器进行支持

#### 事件广播

- [AuthenticationBroadcaster](./feign/src/client/AuthenticationStrategy.ts)认证相关的事件广播者，在接收到401响应后广播认证失效事件

#### 集成的配置示例，通过 boot-starter

```typescript
import {
    AuthenticationClientHttpRequestInterceptor,
    AuthenticationStrategy,
    AuthenticationToken,
    CodecFeignClientExecutorInterceptor,
    DateEncoder,
    HttpMediaType,
    HttpRequest,
    HttpResponse,
    HttpStatus,
    NetworkClientHttpRequestInterceptor,
    ProcessBarExecutorInterceptor,
    ProgressBarOptions,
    RoutingClientHttpRequestInterceptor,
    SimpleNetworkStatusListener,
    stringDateConverter,
    UnifiedFailureToastExecutorInterceptor
} from 'fengwuxp-typescript-feign'
import {
    ClientHttpInterceptorRegistry,
    FeignClientInterceptorRegistry,
    FeignConfigurationAdapter,
    feignConfigurationInitializer,
} from 'feign-boot-stater'
import {BrowserHttpAdapter, BrowserNetworkStatusListener} from 'feign-boot-browser-stater'

import {message} from 'antd';
import {AppStorage} from '@/BrowserAppStorage';
import UserService from "@/feign/user/UserService";
import {OakApiSignatureStrategy} from "oak-common";
import {removeLoginUser} from "@/SessionManager";
import AppRouter from './AppRouter';
import {API_ADDRESS, APP_ID, APP_SECRET} from "@/env/EnvVariableConfiguration";


/**
 * app接口鉴权策略
 */
class AppAuthenticationStrategy implements AuthenticationStrategy {

    /**
     * 添加鉴权请求头
     * @param authorization    本地缓存的鉴权对象 {@see AppAuthenticationStrategy#getAuthorization}
     * @param headers          请求头
     */
    public appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
        headers.Authorization = authorization.authorization;
        return headers
    };

    /**
     * 获取本地缓存的鉴权对象
     * @param req
     */
    public getAuthorization = (req: Readonly<HttpRequest>) => {
        console.log('获取token', req);
        return AppStorage.getUserInfo().then(userInfo => ({
            authorization: userInfo.token,
            expireDate: userInfo.tokenExpired,
        })).catch(e => ({
            authorization: null,
            expireDate: -1
        }))
    };

    /**
     * token要过期提前刷新token
     * @param authorization      本地缓存的鉴权对象 {@see AppAuthenticationStrategy#getAuthorization}
     * @param req                触发刷新token的请求的请求参数
     */
    public refreshAuthorization = (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
        authorization.authorization = "11111111";

        return UserService.refreshToken({}, {
            headers: this.appendAuthorizationHeader(authorization, req.headers || {})
        }).then((userInfo) => {
            return AppStorage.setUserInfo(userInfo).then(() => {
                return {
                    authorization: userInfo.token,
                    expireDate: userInfo.tokenExpired
                }
            });
        })
    }

    /**
     * 获取默认的鉴权类型
     * 该方法可以不实现，默认为AuthenticationType#FORCE
     */
    public getDefaultAuthenticationType = () => {
        return AuthenticationType.FORCE;
    }
}


class BrowserFeignConfigurationAdapter implements FeignConfigurationAdapter {


    public defaultProduce = () => HttpMediaType.FORM_DATA;

    public httpAdapter = () => new BrowserHttpAdapter(20 * 1000);


    public apiSignatureStrategy = () => {

        return new OakApiSignatureStrategy(APP_ID, APP_SECRET, "web");
    };

    public registryClientHttpRequestInterceptors = (interceptorRegistry: ClientHttpInterceptorRegistry) => {
        interceptorRegistry.addInterceptor(new NetworkClientHttpRequestInterceptor(
            new BrowserNetworkStatusListener(),
            new SimpleNetworkStatusListener()));
        interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor(API_ADDRESS));
        interceptorRegistry.addInterceptor(new AuthenticationClientHttpRequestInterceptor(new AppAuthenticationStrategy()))
            .excludePathPatterns("/login", "/api/mock/**")
    }

    public registryFeignClientExecutorInterceptors = (interceptorRegistry: FeignClientInterceptorRegistry) => {
        interceptorRegistry.addInterceptor(new ProcessBarExecutorInterceptor({
            hideProgressBar() {
                message.loading('')
            },
            showProgressBar(options: ProgressBarOptions) {
                message.destroy()
            },
        }))

        // codec
        interceptorRegistry.addInterceptor(new CodecFeignClientExecutorInterceptor(
            [
                // 将时间类型转换为 时间戳格式
                new DateEncoder(stringDateConverter()),
            ],
        ));

        // 统一数据转换，错误提示
        interceptorRegistry.addInterceptor(new UnifiedFailureToastExecutorInterceptor(
            (response: HttpResponse | string) => {
                console.log('response', response);
                let text = response;
                if (typeof response === "object") {
                    if (response.statusCode === HttpStatus.GATEWAY_TIMEOUT) {
                        text = response.statusText;
                    } else {
                        const data = response.data;
                        if (data != null) {
                            text = data.message;
                        }
                    }
                }
                message.error(text)
            },
            () => {
                console.log("==to login=>")
                removeLoginUser();
                AppRouter.login()
            }))
    };

    public feignUIToast = () => (text: string) => {
        message.info(text)
    }
}

/**
 * 注册feign 代理
 */
feignConfigurationInitializer(new BrowserFeignConfigurationAdapter());
```

- feignConfigurationInitializer会把配置设置到执行上下文中，由于程序会在请求时异步的获取配置，建议在程序中尽早的执行该方法，减少请求时等待配置的获取时间
-
参考示例项目[RegisterBrowserOpenFeign](https://github.com/fengwuxp/fengwuxp-typescript-spring/blob/master/templates/umi-antd-v4-template/src/RegisterBrowserOpenFeign.ts)

#### typescript feign 实现

- [feign](./feign)
- [feign-boot-starter](./feign-boot) 提供简易的初始化配置

##### typescript feign boot starter

- [feign-browser-boot](./feign-browser-boot)                 提供浏览器的初始化配置
- [feign-nodejs-boot](./feign-nodejs-boot)                   提供nodejs的初始化配置
- [feign-tarojs-boot](./feign-tarojs-boot)                   提供tarojs的初始化配置
- [feign-weex-boot](./feign-weex-boot)                       提供weex的初始化配置
- [feign-react-native-boot](./feign-react-native-boot)       提供react-native的初始化配置

#### 扩展介绍

- [如何高效的给后端系统发起http请求](https://blog.csdn.net/u014739462/article/details/86758900)
- [通过生成Api sdk提升开发体验和效率](https://blog.csdn.net/u014739462/article/details/112061021)
- [通过java（基于spring）代码生成 feign sdk](https://github.com/fengwuxp/common-codegen)

#### 其他语言实现

- [fengwuxp_dart_feign](https://github.com/fengwuxp/fengwuxp_dart_feign)