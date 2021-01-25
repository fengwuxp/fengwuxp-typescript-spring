import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {HttpRequest} from "./HttpRequest";
import {ApiPermissionProbeStrategy, ApiPermissionProbeStrategyInterface} from "./AuthenticationStrategy";
import {REQUEST_AUTHENTICATION_TYPE_HEADER_NAME} from "../constant/FeignConstVar";
import {RequestAuthenticationType} from "../annotations/mapping/Mapping";
import {AuthenticationType} from "../constant/AuthenticationType";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {appendRequestContextId, getFeignClientMethodConfigurationByRequest,} from "../context/RequestContextHolder";

/**
 * 用于探测API接口权限，并做处理
 * <p>
 *    权限探测请求：默认的{@link ApiPermissionProbeStrategy}会使用当前请求的url使用{@link HttpMethod#HEAD}发送请求，并携带
 *    请求头'X-Api-Authentication-Type'='Probe'
 *
 *    服务端处理：默认服务端应该返回响应头'X-Api-Authentication-Type',响应头的值范围为：'NONE'|'TRY'|FORCE，如果响应头的值为其他类型，
 *    需要自己实现认证拦截器
 * </p>
 * @see AuthenticationClientHttpRequestInterceptor
 */
export default class ApiPermissionProbeInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {

    private permissionProbeStrategy: ApiPermissionProbeStrategyInterface;

    constructor(permissionProbeStrategy?: ApiPermissionProbeStrategy) {
        this.permissionProbeStrategy = this.getApiPermissionProbeStrategy(permissionProbeStrategy);
    }

    interceptor = async (req: T): Promise<T> => {
        if (req.headers[REQUEST_AUTHENTICATION_TYPE_HEADER_NAME] != null) {
            // 用于获取接口权限的请求，直接跳过
            return req;
        }
        const requestMapping = getFeignClientMethodConfigurationByRequest(req)?.requestMapping;
        if (requestMapping == null) {
            return req;
        }
        if (requestMapping.authenticationType == null || requestMapping.authenticationType === AuthenticationType.DEFAULT) {
            const {permissionProbeStrategy} = this;
            const url = req.url.split("?")[0];
            const headers = await permissionProbeStrategy.probe(url);
            let requestAuthenticationType: RequestAuthenticationType;
            if (headers == null) {
                requestAuthenticationType = AuthenticationType.NONE;
            } else {
                requestAuthenticationType = headers[REQUEST_AUTHENTICATION_TYPE_HEADER_NAME] as RequestAuthenticationType;
                if (typeof requestAuthenticationType === "string") {
                    requestAuthenticationType = AuthenticationType[requestAuthenticationType];
                }
            }
            requestMapping.authenticationType = requestAuthenticationType;
        }
        return req;
    }

    private getApiPermissionProbeStrategy = (apiPermissionProbeStrategy?: ApiPermissionProbeStrategy): ApiPermissionProbeStrategyInterface => {
        if (apiPermissionProbeStrategy == null) {
            return ApiPermissionProbeInterceptor.getDefaultApiPermissionProbeStrategy();
        }
        return typeof apiPermissionProbeStrategy == "function" ? {
            probe: apiPermissionProbeStrategy
        } : apiPermissionProbeStrategy;
    }

    private static getDefaultApiPermissionProbeStrategy = (): ApiPermissionProbeStrategyInterface => {
        return {
            probe: (url: string) => {
                return FeignConfigurationRegistry.getDefaultFeignConfiguration().then(config => {
                    return config.getRestTemplate().headForHeaders(url, undefined, appendRequestContextId({
                        [REQUEST_AUTHENTICATION_TYPE_HEADER_NAME]: 'Probe'
                    }));
                })
            }
        };
    }


}