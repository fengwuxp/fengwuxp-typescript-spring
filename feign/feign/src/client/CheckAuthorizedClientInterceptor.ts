import {ClientHttpRequestInterceptorFunction} from "./ClientHttpRequestInterceptor";
import {HttpRequest} from "./HttpRequest";
import {AuthenticationType} from "../constant/AuthenticationType";
import {AuthenticationToken} from "./AuthenticationStrategy";
import {UNAUTHORIZED_RESPONSE} from "../constant/FeignConstVar";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {getFeignClientMethodConfiguration} from "../context/RequestContextHolder";


const isAuthorized = async (getAuthenticationStrategy, req): Promise<void> => {
    let result: AuthenticationToken;
    try {
        result = await getAuthenticationStrategy().getAuthorization(req);
    } catch (e) {
        return Promise.reject(e);
    }
    const authorized = result != null && result.expireDate >= new Date().getTime() + 10 * 1000;
    return authorized ? Promise.resolve() : Promise.reject();
}

/**
 * 检查是否已认证的拦截器，如果未认证，将会模拟返回 401 响应
 * @param req
 */
const CheckAuthorizedClientInterceptor: ClientHttpRequestInterceptorFunction<HttpRequest> = (req) => {

    const feignMethodConfig = getFeignClientMethodConfiguration(req);
    //requestMapping
    const {requestMapping} = feignMethodConfig;

    return FeignConfigurationRegistry.getDefaultFeignConfiguration().then(({getAuthenticationStrategy,}) => {
        // need certification
        if (requestMapping.authenticationType !== AuthenticationType.FORCE) {
            return req;
        }
        if (getAuthenticationStrategy == null) {
            return req;
        }

        return isAuthorized(getAuthenticationStrategy, req).then(() => req)
            .catch(() => {
                return Promise.reject(UNAUTHORIZED_RESPONSE)
            });
    });
}

export default CheckAuthorizedClientInterceptor;