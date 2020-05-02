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
// console.log("注册feign")
feignConfigurationInitializer(new BrowserFeignConfigurationAdapter());
