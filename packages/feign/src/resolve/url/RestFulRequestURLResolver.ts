import {RequestURLResolver} from "./RequestURLResolver";

import {FeignOptions} from "../../annotations/Feign";
import {FeignProxyClient} from "../../support/FeignProxyClient";

/**
 * restful requet url resolver
 * @param apiService
 * @param methodName
 */
export const restfulRequestURLResolver: RequestURLResolver = (apiService: FeignProxyClient, methodName: string): string => {

    const feignOptions = apiService.feignOptions;

    //生成 例如 @member/member/queryMember 或 @default/member/{memberId}
    return `${getApiUriByApiService(apiService, feignOptions)}${getApiUriByApiServiceMethod(apiService, methodName)}`;
};

/**
 * 通过ApiService 生成uri
 * @param apiService
 * @param feignOptions
 */
export const getApiUriByApiService = (apiService: FeignProxyClient, feignOptions: FeignOptions) => {

    const {apiModule, url} = feignOptions;
    if (url) {
        return `${url}`
    }
    const serviceName = apiService.serviceName;
    return `@${apiModule}${serviceName.startsWith("/") ? serviceName : "/" + serviceName}`;
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
        value = "";
    } else {
        value = apiServiceConfig.requestMapping.value
    }
    const notText = value == null || value.trim().length == 0;
    if (notText) {
        return value;
    }

    return value.startsWith("/") ? value : `/${value}`;
};


