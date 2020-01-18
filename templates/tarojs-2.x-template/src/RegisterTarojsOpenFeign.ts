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
    stringDateConverter
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
import {OakUnifiedRespProcessInterceptor, OakApiSignatureStrategy} from "oak_common";

class AppAuthenticationStrategy implements AuthenticationStrategy {


    public appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>) => {
        headers.token = authorization.authorization;
        return headers
    }

    /**
     * 获取本地存储的token
     * @param req
     */
    public getAuthorization = (req: Readonly<HttpRequest>) => {

        return AppStorage.getMemberInfo().then((userInfo) => {

            return {
                authorization: userInfo.token,
                expireDate: userInfo.expiration_date
            } as any
        }).catch((e) => {
            return {
                authorization: null,
                expireDate: -1
            }
        })

    };

    /**
     * 刷新用户token
     * @param authorization
     * @param req
     */
    public refreshAuthorization = (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
        return Promise.resolve({
            authorization: null,
            expireDate: -1
        } as any)
    }


}


export class TarojsFeignConfigurationAdapter implements FeignConfigurationAdapter {

    public defaultProduce = () => {
        return HttpMediaType.APPLICATION_JSON_UTF8
    }

    public httpAdapter = () => {
        return new TarojsHttpAdaptor(10 * 1000)
    }

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
        }))

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

        }))
    };
    apiSignatureStrategy = () => {

        const OAK = process.env.OAK;
        return new OakApiSignatureStrategy(OAK.clientId, OAK.clientSecret,"minapp");
    }


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
