import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {HttpRequest, HttpRequestContext} from "./HttpRequest";
import {ApiPermissionProbeStrategy, ApiPermissionProbeStrategyInterface} from "./AuthenticationStrategy";
import {REQUEST_AUTHENTICATION_TYPE_HEADER_NAME} from "../constant/FeignConstVar";
import {RequestAuthenticationType} from "../annotations/mapping/Mapping";
import {AuthenticationType} from "../constant/AuthenticationType";
import {getRequestFeignClientMethodConfiguration, getRequestFeignConfiguration,} from "../context/RequestContextHolder";

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

    private permissionProbeStrategy?: ApiPermissionProbeStrategy;

    constructor(permissionProbeStrategy?: ApiPermissionProbeStrategy) {
        this.permissionProbeStrategy = permissionProbeStrategy;
    }

    intercept = async (req: T): Promise<T> => {
        if (req.headers[REQUEST_AUTHENTICATION_TYPE_HEADER_NAME] != null) {
            // 用于获取接口权限的请求，直接跳过，避免死循环
            return req;
        }
        const requestMapping = getRequestFeignClientMethodConfiguration(req)?.requestMapping;
        if (requestMapping == null) {
            return req;
        }
        if (requestMapping.authenticationType == null || requestMapping.authenticationType === AuthenticationType.DEFAULT) {
            const url = req.url.split("?")[0];
            const responseHeaders = await this.getApiPermissionProbeStrategy(req).probe(url);
            // 更新接口权限
            requestMapping.authenticationType = this.parseAuthenticationType(responseHeaders);
        }
        return req;
    }

    private parseAuthenticationType = (responseHeaders): RequestAuthenticationType => {
        if (responseHeaders == null) {
            return AuthenticationType.NONE;
        }
        const requestAuthenticationType = responseHeaders[REQUEST_AUTHENTICATION_TYPE_HEADER_NAME] as RequestAuthenticationType;
        if (typeof requestAuthenticationType === "string") {
            return AuthenticationType[requestAuthenticationType];
        }
        return requestAuthenticationType;
    }

    private getApiPermissionProbeStrategy = (context: HttpRequestContext): ApiPermissionProbeStrategyInterface => {
        const {permissionProbeStrategy} = this;
        if (permissionProbeStrategy == null) {
            return this.getDefaultApiPermissionProbeStrategy(context);
        }
        return typeof permissionProbeStrategy == "function" ? {
            probe: permissionProbeStrategy
        } : permissionProbeStrategy;
    }

    private getDefaultApiPermissionProbeStrategy = (context: HttpRequestContext): ApiPermissionProbeStrategyInterface => {
        return {
            probe: (url: string) => {
                return getRequestFeignConfiguration(context).getRestTemplate().headForHeaders(url, undefined, {
                    REQUEST_AUTHENTICATION_TYPE_HEADER_NAME: "Probe"
                })
            }
        };
    }
}