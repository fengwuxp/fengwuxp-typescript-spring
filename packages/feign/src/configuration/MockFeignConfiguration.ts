import {FeignConfiguration} from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import MockHttpAdapter from "../adapter/mock/MockHttpAdapter";
import RoutingClientHttpRequestInterceptor from "../client/RoutingClientHttpRequestInterceptor";
import {HttpRequest} from "../client/HttpRequest";
import NetworkClientHttpRequestInterceptor from "../client/NetworkClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "../client/NetworkStatusListener";
import FeignClientExecutorInterceptorExecutor from "../FeignClientExecutorInterceptorExecutor";
import ProcessBarExecutorInterceptor from "../ui/ProcessBarExecutorInterceptor";
import {ProgressBarOptions} from "../FeignRequestOptions";
import CodecFeignClientExecutorInterceptor from "../codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../codec/DateEncoder";


/**
 * mock feign configuration
 */
export class MockFeignConfiguration implements FeignConfiguration {

    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new MockHttpAdapter(this.baseUrl);

    getHttpClient = <T extends HttpRequest = HttpRequest>() => {
        const httpClient = new DefaultHttpClient(this.getHttpAdapter());
        const interceptors = [
            new NetworkClientHttpRequestInterceptor<T>(new class implements NetworkStatusListener {
                getNetworkStatus = (): Promise<NetworkStatus> => {

                    return Promise.resolve({
                        isConnected: false,
                        networkType: NetworkType["4G"]
                    })
                };

                onChange = (callback: (networkStatus: NetworkStatus) => void): void => {
                    setTimeout(() => {
                        console.log("网络恢复");
                        callback({
                            isConnected: true,
                            networkType: NetworkType["4G"]
                        })
                    }, 6 * 1000)

                };

            }),
            new RoutingClientHttpRequestInterceptor(this.baseUrl)
        ];
        httpClient.setInterceptors(interceptors);
        return httpClient;
    };

    getRestTemplate = () => new RestTemplate(this.getHttpClient());

    getFeignClientExecutorInterceptorExecutor = (): FeignClientExecutorInterceptorExecutor => {

        return new FeignClientExecutorInterceptorExecutor([
            new ProcessBarExecutorInterceptor({
                showProgressBar: (progressBarOptions?: ProgressBarOptions) => {
                    console.log("showProgressBar", progressBarOptions);
                },
                hideProgressBar: () => {
                    console.log("hideProgressBar");
                }
            }),
            new CodecFeignClientExecutorInterceptor([
                new DateEncoder()
            ], [])
        ]);
    };


}
