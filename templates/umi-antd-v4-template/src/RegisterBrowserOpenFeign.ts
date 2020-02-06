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
  UnifiedFailureToastExecutorInterceptor,
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

class AppAuthenticationStrategy implements AuthenticationStrategy {

  public appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
    headers.Authorization = authorization.authorization;
    return headers
  };

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

  public refreshAuthorization = (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
    authorization.authorization = "11111111";
    console.log("refresh token", authorization, req);

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
}


class BrowserFeignConfigurationAdapter implements FeignConfigurationAdapter {
  public defaultProduce = () => HttpMediaType.FORM_DATA

  public httpAdapter = () => new BrowserHttpAdapter(20 * 1000)

  public registryClientHttpRequestInterceptors = (interceptorRegistry: ClientHttpInterceptorRegistry) => {
    interceptorRegistry.addInterceptor(new NetworkClientHttpRequestInterceptor(
      new BrowserNetworkStatusListener(),
      new SimpleNetworkStatusListener()));
    interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor(process.env.API_ADDRESS));
    interceptorRegistry.addInterceptor(new AuthenticationClientHttpRequestInterceptor(new AppAuthenticationStrategy()))
      .excludePathPatterns("/login")
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
    interceptorRegistry.addInterceptor(new UnifiedFailureToastExecutorInterceptor((response: HttpResponse | string) => {
      console.log('response', response)
      message.info(response)
    }))
  }

  public feignUIToast = () => (text: string) => {
    message.info(text)
  }
}

/**
 * 注册feign 代理
 */
// console.log("注册feign")
feignConfigurationInitializer(new BrowserFeignConfigurationAdapter());
