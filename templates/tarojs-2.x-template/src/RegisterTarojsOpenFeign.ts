import {
    AuthenticationClientHttpRequestInterceptor,
    AuthenticationStrategy,
    AuthenticationToken,
    CodecFeignClientExecutorInterceptor,
    DateEncoder,
    HttpMediaType,
    HttpRequest,
    NetworkClientHttpRequestInterceptor,
    ProcessBarExecutorInterceptor,
    ProgressBarOptions,
    RoutingClientHttpRequestInterceptor,
    SimpleNetworkStatusListener,
    stringDateConverter,
    simpleRequestURLResolver
} from 'fengwuxp-typescript-feign'
import {
    ClientHttpInterceptorRegistry,
    FeignClientInterceptorRegistry,
    FeignConfigurationAdapter,
    feignConfigurationInitializer
} from 'feign-boot-stater'
import {TarojsHttpAdaptor, TarojsNetworkStatusListener} from 'feign-boot-tarojs-stater'
import Taro from '@tarojs/taro'
import {AppStorage} from "./AppStorage";
import {OakUnifiedRespProcessInterceptor, OakApiSignatureStrategy} from "oak-common";

class AppAuthenticationStrategy implements AuthenticationStrategy {


    public appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
        headers.token = authorization.authorization;
        return headers
    };

    /**
     * 获取本地存储的token
     * @param req
     */
    public getAuthorization = (req: Readonly<HttpRequest>) => {

        return AppStorage.getMemberInfo().then((userInfo) => {

            return {
                authorization: "11",
                expireDate: new Date().getTime()
            } as any
        }).catch((e) => {
            return {
                authorization: '12',
                expireDate: new Date().getTime()
            }
        })

    };

    /**
     * 刷新用户token
     * @param authorization
     * @param req
     */
    public refreshAuthorization = (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
        console.log("刷新token", authorization);
        return Promise.resolve({
            authorization: "13",
            expireDate: -1
        } as any)
    }


}


export class TarojsFeignConfigurationAdapter implements FeignConfigurationAdapter {

    public defaultProduce = () => {
        return HttpMediaType.APPLICATION_JSON_UTF8
    };

    public httpAdapter = () => {
        return new TarojsHttpAdaptor(10 * 1000)
    };

    public registryClientHttpRequestInterceptors = (interceptorRegistry: ClientHttpInterceptorRegistry) => {
        interceptorRegistry.addInterceptor(new NetworkClientHttpRequestInterceptor(
            new TarojsNetworkStatusListener()
            , new SimpleNetworkStatusListener()))
        interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor(process.env.API_ENTRY_ADDRESS));
        interceptorRegistry.addInterceptor(new AuthenticationClientHttpRequestInterceptor(new AppAuthenticationStrategy()))
    };

    public registryFeignClientExecutorInterceptors = (interceptorRegistry: FeignClientInterceptorRegistry) => {
        interceptorRegistry.addInterceptor(new ProcessBarExecutorInterceptor({
            hideProgressBar() {
                Taro.hideLoading()
            },
            showProgressBar(options: ProgressBarOptions) {
                Taro.showLoading({
                    title: ""
                })
            }
        }));

        // codec
        interceptorRegistry.addInterceptor(new CodecFeignClientExecutorInterceptor(
            [
                // 将时间类型转换为 yyyy-MM-dd mm:HH:ss
                new DateEncoder(stringDateConverter())
            ]
        ));

        // 统一数据转换，错误提示
        interceptorRegistry.addInterceptor(new OakUnifiedRespProcessInterceptor((message: string) => {

            Taro.showToast({
                title: message
            })

        }, () => {
            // 服务端返回需要登录的状态时回调这里
        }))
    };
    apiSignatureStrategy = () => {

        const OAK = process.env.OAK;
        return new OakApiSignatureStrategy(OAK.clientId, OAK.clientSecret, "minapp");
    }

    // 使用简单的url解析器
    requestURLResolver = () => simpleRequestURLResolver;


    public feignUIToast = () => {
        return (message: string) => {
            Taro.showToast({
                title: message
            })
        }
    }

}

/**
 * 注册feign 代理
 */
feignConfigurationInitializer(new TarojsFeignConfigurationAdapter())
