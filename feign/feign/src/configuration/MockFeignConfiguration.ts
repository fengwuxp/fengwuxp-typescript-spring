import {FeignConfiguration} from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import MockHttpAdapter from "../adapter/mock/MockHttpAdapter";
import RoutingClientHttpRequestInterceptor from "../client/RoutingClientHttpRequestInterceptor";
import {HttpRequest} from "../client/HttpRequest";
import NetworkClientHttpRequestInterceptor from "../network/NetworkClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "../network/NetworkStatusListener";
import ProcessBarExecutorInterceptor from "../ui/ProcessBarExecutorInterceptor";
import {ProgressBarOptions} from "../FeignRequestOptions";
import CodecFeignClientExecutorInterceptor from "../codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../codec/DateEncoder";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";

import * as log4js from "log4js";
import UnifiedFailureToastExecutorInterceptor from "../ui/UnifiedFailureToastExecutorInterceptor";

const logger = log4js.getLogger();
logger.level = 'debug';

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

                    return Promise.resolve(this.mockNetworkState());
                };

                onChange = (callback: (networkStatus: NetworkStatus) => void): void => {

                    this.onMockNetworkChangeEvent((networkStatus) => {
                        logger.debug("网络状态变化", networkStatus);
                        callback(networkStatus);
                    })

                };

                private onMockNetworkChangeEvent = (callback) => {
                    setTimeout(() => {
                        callback(this.mockNetworkState());
                        this.onMockNetworkChangeEvent(callback);
                    }, Math.random() * 5500 + 120);
                };

                private mockNetworkState = () => {
                    const b = new Date().getTime() % 3 === 0;
                    logger.debug("----网络状态--->", b ? "可用" : "不可用");
                    if (b) {
                        return {
                            isConnected: true,
                            networkType: NetworkType["4G"]
                        }
                    } else {
                        return {
                            isConnected: false,
                            networkType: NetworkType.NONE
                        }

                    }
                }

            }),
            new RoutingClientHttpRequestInterceptor(this.baseUrl)
        ];
        httpClient.setInterceptors(interceptors);
        return httpClient;
    };

    getRestTemplate = () => new RestTemplate(this.getHttpClient());

    getFeignClientExecutorInterceptors = (): FeignClientExecutorInterceptor[] => {
        return [
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
            ], []),

            new UnifiedFailureToastExecutorInterceptor((response) => {
                console.log("-----UnifiedTransformDataExecutorInterceptor-->", response);
            })
        ]
    };

    getFeignUIToast = () => {
        return (message: string) => {
            logger.info("--ui toast--->", message);
        }
    }


}
