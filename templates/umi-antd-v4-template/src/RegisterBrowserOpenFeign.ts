import {
  AuthenticationClientHttpRequestInterceptor,
  AuthenticationStrategy,
  AuthenticationToken,
  CodecFeignClientExecutorInterceptor,
  DateEncoder,
  HttpMediaType,
  HttpRequest,
  HttpResponse,
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
  feignConfigurationInitializer
} from 'feign-boot-stater'
import {BrowserHttpAdapter, BrowserNetworkStatusListener} from 'feign-boot-browser-stater'

import {message} from 'antd';
import {AppStorage} from "@/BrowserAppStorage";

class AppAuthenticationStrategy implements AuthenticationStrategy {

  public appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
    headers.Authorization = authorization.authorization
    return headers
  }

  public getAuthorization = (req: Readonly<HttpRequest>) => {
    console.log("获取token")
    return AppStorage.getUserInfo().then((userInfo) => {
      return {
        authorization: userInfo.token,
        expireDate: userInfo.expiration_date
      }
    }).catch((e) => {
      return {
        authorization: null,
        expireDate: -1
        // expireDate: new Date().getTime() + 1000 * 1000
      }
    })
  }
  public refreshAuthorization = (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
    // return UserService.refreshToken({}, {
    //   headers: this.appendAuthorizationHeader(authorization, req.headers || {})
    // }).then((userInfo) => {
    //   return AppStorage.setUserInfo(userInfo).then(() => {
    //     return {
    //       authorization: userInfo.token,
    //       expireDate: userInfo.expiration_date
    //     }
    //   })
    // })

    return {
      authorization: null,
      expireDate: -1
    }
  }

}


class BrowserFeignConfigurationAdapter implements FeignConfigurationAdapter {
  public defaultProduce = () => {
    return HttpMediaType.FORM_DATA
  }

  public httpAdapter = () => {
    return new BrowserHttpAdapter(10 * 1000)
  }

  public registryClientHttpRequestInterceptors = (interceptorRegistry: ClientHttpInterceptorRegistry) => {
    interceptorRegistry.addInterceptor(new NetworkClientHttpRequestInterceptor(
      new BrowserNetworkStatusListener()
      , new SimpleNetworkStatusListener()))
    interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor(""))
    interceptorRegistry.addInterceptor(new AuthenticationClientHttpRequestInterceptor(new AppAuthenticationStrategy()))
      .excludePathPatterns()

  }

  public registryFeignClientExecutorInterceptors = (interceptorRegistry: FeignClientInterceptorRegistry) => {
    interceptorRegistry.addInterceptor(new ProcessBarExecutorInterceptor({
      hideProgressBar() {
        message.loading('')
      },
      showProgressBar(options: ProgressBarOptions) {
        message.destroy()
      }
    }))

    // codec
    interceptorRegistry.addInterceptor(new CodecFeignClientExecutorInterceptor(
      [
        // 将时间类型转换为 时间戳格式
        new DateEncoder(stringDateConverter())
      ]
    ));

    // 统一数据转换，错误提示
    interceptorRegistry.addInterceptor(new UnifiedFailureToastExecutorInterceptor((response: HttpResponse | string) => {
      console.log('response', response)
      message.info(response)
    }))
  }

  public feignUIToast = () => {
    return (text: string) => {
      message.info(text)
    }
  }

}

/**
 * 注册feign 代理
 */
// console.log("注册feign")
feignConfigurationInitializer(new BrowserFeignConfigurationAdapter());
