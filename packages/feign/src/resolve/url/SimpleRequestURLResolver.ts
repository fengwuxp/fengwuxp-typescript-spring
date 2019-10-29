import {RequestURLResolver} from "./RequestURLResolver";
import {FeignProxyClient} from "../../support/FeignProxyClient";
import {getApiUriByApiService} from "./RestFulRequestURLResolver";

/**
 * 简单的url解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成url
 */
export const simpleRequestURLResolver: RequestURLResolver = (apiService: FeignProxyClient, methodName: string) => {
    const feignOptions = apiService.feignOptions;

    //生成 例如 @member/member/queryMember 或 @default/member/{memberId}
    return `${getApiUriByApiService(apiService, feignOptions)}${getApiUriByApiServiceMethod(apiService, methodName)}`;
};


/**
 * 通过 ApiService Method 生成uri
 * @param apiService
 * @param methodName
 */
const getApiUriByApiServiceMethod = (apiService: FeignProxyClient, methodName: string) => {

    const apiServiceConfig = apiService.getFeignMethodConfig(methodName);
    let value;
    if (apiServiceConfig.requestMapping == null || apiServiceConfig.requestMapping.value == null) {
        value = methodName;
    } else {
        value = apiServiceConfig.requestMapping.value
    }

    return value.startsWith("/") ? value : `/${value}`;
};


