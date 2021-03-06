import {FeignConfiguration} from "../../src/configuration/FeignConfiguration";
import DefaultFeignClientExecutor from "../../src/DefaultFeignClientExecutor";
import {FeignProxyClient} from "../../src/support/FeignProxyClient";
import DefaultHttpClient from "../../src/client/DefaultHttpClient";
import RestTemplate from "../../src/template/RestTemplate";
import MockHttpAdapter from "./MockHttpAdapter";
import RoutingClientHttpRequestInterceptor from "../../src/client/RoutingClientHttpRequestInterceptor";
import {HttpRequest} from "../../src/client/HttpRequest";
import NetworkClientHttpRequestInterceptor from "../../src/network/NetworkClientHttpRequestInterceptor";
import {NetworkStatus, NetworkStatusListener, NetworkType} from "../../src/network/NetworkStatusListener";
import ProcessBarExecutorInterceptor from "../../src/ui/ProcessBarExecutorInterceptor";
import {FeignRequestContextOptions} from "../../src/FeignRequestOptions";
import CodecFeignClientExecutorInterceptor from "../../src/codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../../src/codec/DateEncoder";
import {FeignClientExecutorInterceptor} from "../../src/FeignClientExecutorInterceptor";

import UnifiedFailureToastExecutorInterceptor from "../../src/ui/UnifiedFailureToastExecutorInterceptor";
import AuthenticationClientHttpRequestInterceptor from "../../src/client/AuthenticationClientHttpRequestInterceptor";
import {ApiSignatureStrategy} from '../../src/signature/ApiSignatureStrategy';
import {RequestHeaderResolver} from '../../src/resolve/header/RequestHeaderResolver';
import {simpleRequestURLResolver} from '../../src/resolve/url/SimpleRequestURLResolver';
import {AuthenticationToken} from "../../src/client/AuthenticationStrategy";
import {ProgressBarOptions} from '../../src/ui/RequestProgressBar';
import TraceRequestExecutorInterceptor from "../../src/trace/TraceRequestExecutorInterceptor";
import ApiPermissionProbeInterceptor from "../../src/client/ApiPermissionProbeInterceptor";
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';

let refreshTokenCount = 0;


/**
 * mock feign configuration
 */
export class MockFeignConfiguration implements FeignConfiguration {

    protected baseUrl: string = "http://test.ab.com/api/";

    constructor() {

    }

    getApiSignatureStrategy: () => ApiSignatureStrategy;

    getDefaultFeignRequestContextOptions: () => FeignRequestContextOptions;

    getRequestHeaderResolver: () => RequestHeaderResolver;

    getRequestURLResolver = () => simpleRequestURLResolver


    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new MockHttpAdapter(this.baseUrl);

    getHttpClient = <T extends HttpRequest = HttpRequest>() => {
        const httpClient = new DefaultHttpClient(this.getHttpAdapter());
        const authenticationToken = {
            authorization: "123",
            expireDate: new Date().getTime() + 2 * 60 * 1000
        };

        const interceptors = [
            new NetworkClientHttpRequestInterceptor<T>(new class implements NetworkStatusListener {

                getNetworkStatus = (): Promise<NetworkStatus> => {

                    return Promise.resolve(this.mockNetworkState());
                };

                onChange = (callback: (networkStatus: NetworkStatus) => void): void => {

                    this.onMockNetworkChangeEvent((networkStatus) => {
                        logger.debug("[NetworkClientHttpRequestInterceptor]网络状态变化", networkStatus);
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
                    const b = true;//new Date().getTime() % 3 === 0;
                    logger.debug("[NetworkClientHttpRequestInterceptor]----网络状态--->", b ? "可用" : "不可用");
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
            new RoutingClientHttpRequestInterceptor(this.baseUrl),
            new ApiPermissionProbeInterceptor(),
            new AuthenticationClientHttpRequestInterceptor({
                getAuthorization: (req): AuthenticationToken => {

                    return {
                        authorization: Math.round(1) + '',
                        expireDate: -1
                    }
                },
                refreshAuthorization: (authorization, req) => {
                    ++refreshTokenCount;
                    logger.log("[AuthenticationStrategy]--refresh token->", refreshTokenCount, authenticationToken);
                    const _newAuthenticationToken = {
                        ...authenticationToken
                    };
                    _newAuthenticationToken.authorization = Math.round(1) + '';// "refresh-token";
                    _newAuthenticationToken.expireDate = new Date().getTime() + 60 * 60 * 1000;
                    authorization = _newAuthenticationToken;
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(_newAuthenticationToken)
                        }, 10 * 1000);
                    });
                },
                appendAuthorizationHeader: (authorization, header) => {
                    header["Authorization"] = authorization.authorization;
                    return header;
                },
                getAuthorizationHeaderNames: () => {
                    return ["Authorization"]
                },
            })
        ];
        httpClient.setInterceptors(interceptors);
        return httpClient;
    };

    getRestTemplate = () => new RestTemplate(this.getHttpClient());

    getFeignClientExecutorInterceptors = (): FeignClientExecutorInterceptor[] => {

        return [
            new ProcessBarExecutorInterceptor({
                showProgressBar: (progressBarOptions?: ProgressBarOptions) => {
                    logger.log("[ProcessBarExecutorInterceptor]showProgressBar", progressBarOptions);
                },
                hideProgressBar: () => {
                    logger.log("[ProcessBarExecutorInterceptor]hideProgressBar");
                }
            }),
            new CodecFeignClientExecutorInterceptor([
                new DateEncoder(),
            ], []),

            new UnifiedFailureToastExecutorInterceptor((response) => {
                logger.log("[UnifiedTransformDataExecutorInterceptor]", response);
            }),
            new TraceRequestExecutorInterceptor({
                onSuccess: (options, response) => {
                    logger.info("[TraceRequestExecutorInterceptor]请求参数：", options, response);
                }
            })
        ]
    };


    getFeignUIToast = () => {
        return (message: string) => {
            logger.info("[getFeignUIToast]ui toast", message);
        }
    };

    getDefaultHttpHeaders = () => {
        return {
            "mock-key": "1122"
        }
    };


}
