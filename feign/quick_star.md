#### 快速开始

安装 feign-boot-starter

```text
   npm i install feign-boot-starter
```

#### 根据不同的环境使用不同的依赖

- [feign-browser-boot](./feign-browser-boot)                 浏览器环境使用
- [feign-nodejs-boot](./feign-nodejs-boot)                   nodejs 支持
- [feign-tarojs-boot](./feign-tarojs-boot)                   tarojs 支持
- [feign-weex-boot](./feign-weex-boot)                       weex 支持
- [feign-react-native-boot](./feign-react-native-boot)       react-native 支持

```text
    npm i feign-{runEnv}-boot
```

#### 编写接口模板
```typescript
import {Feign, FeignRequestOptions, GetMapping, HttpMediaType, PostMapping} from 'fengwuxp-typescript-feign';
import {LoginReq} from '@/feign/user/req/LoginReq';
import {UserDetails} from '@/feign/user/info/UserDetails';

/**
 * 用户服务
 * */
@Feign({
    value: '/',
})
class UserService {
   
    @PostMapping({
        value: '/login', produces: [HttpMediaType.FORM_DATA]
    })
    login: (req: LoginReq, option?: FeignRequestOptions,
    ) => Promise<void>;

    @PostMapping({
        value: '/logout',
    })
    logout: (req?, option?: FeignRequestOptions) => Promise<void>;


    @GetMapping({
        value: '/api/v1/authentication/details',
    })
    getCurrentUserDetails: (req?, option?: FeignRequestOptions) => Promise<UserDetails>
}

export default new UserService();

```
- 提供自动生成 api 工具[common-codegen](https://github.com/fengwuxp/common-codegen) 暂时只支持 java 服务端代码

#### 配置

```typescript
import {
    ClientHttpRequestInterceptorFunction,
    CodecFeignClientExecutorInterceptor,
    DateEncoder,
    HttpErrorResponseEventPublisherExecutorInterceptor,
    HttpMediaType,
    HttpResponse,
    HttpStatus,
    NetworkClientHttpRequestInterceptor,
    RoutingClientHttpRequestInterceptor,
    SimpleNetworkStatusListener,
    stringDateConverter
} from 'fengwuxp-typescript-feign'
import {
    ClientHttpInterceptorRegistry,
    FeignClientInterceptorRegistry,
    FeignConfigurationAdapter,
} from 'feign-boot-starter'
import {BrowserHttpAdapter, BrowserNetworkStatusListener} from 'feign-boot-browser-starter'

import {API_ENTRY_ADDRESS} from "@/env/EvnVariable";

export default class BrowserFeignConfigurationAdapter implements FeignConfigurationAdapter {

    /**
     * 默认使用的 content-type
     */
    public defaultProduce = () => HttpMediaType.APPLICATION_JSON;

    /**
     * 不同环境实现了不同的 HttpAdapter
     */
    public httpAdapter = () => new BrowserHttpAdapter(20 * 1000);

    public registryClientHttpRequestInterceptors = (interceptorRegistry: ClientHttpInterceptorRegistry) => {
        interceptorRegistry.addInterceptor(new NetworkClientHttpRequestInterceptor(
            new BrowserNetworkStatusListener(),
            new SimpleNetworkStatusListener()));
        // 路由拦截，必须要的
        interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor(API_ENTRY_ADDRESS));
    };

    public registryFeignClientExecutorInterceptors = (interceptorRegistry: FeignClientInterceptorRegistry) => {

        // codec
        interceptorRegistry.addInterceptor(new CodecFeignClientExecutorInterceptor(
            [
                // 将时间类型转换为 时间戳格式
                new DateEncoder(stringDateConverter()),
            ],
        ));

        const unifiedFailureToast = (request: FeignRequestOptions, response: HttpResponse) => {
            console.log('======response====>', response);
            message.error(this.getRespErrorMessage(response) ?? "系统错误", 1.5);
        };
        // 统一错误提示
        interceptorRegistry.addInterceptor(new HttpErrorResponseEventPublisherExecutorInterceptor(unifiedFailureToast))
    };

    private getRespErrorMessage = (response: HttpResponse<any> | string): string => {
        if (response.statusCode === HttpStatus.GATEWAY_TIMEOUT) {
            return response.statusText;
        } else {
            const data = response.data;
            if (data == null) {
                return response.statusText || "请求失败";
            }
            return data.message || "请求出现错误";
        }
    }
}

```

#### 注册配置

这个步骤最好在 index.ts 中做，尽量让注册配置时机靠前

```typescript
import {feignConfigurationInitializer} from "feign-boot-starter";
//  注册feign 代理
const feignConfig = feignConfigurationInitializer(new BrowserFeignConfigurationAdapter());
```