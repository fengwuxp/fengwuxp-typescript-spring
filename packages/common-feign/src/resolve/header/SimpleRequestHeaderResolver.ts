import {RequestHeaderResolver} from "./RequestHeaderResolver";
import {FeignProxyClient} from "../../support/FeignProxyClient";
import {UriVariable} from "../../template/RestOperations";
import {grabUrlPathVariable, matchUrlPathVariable} from "../../constant/FeignConstVar";
import {replacePathVariableValue} from "../../helper/ReplaceUriVariableHelper";


/**
 * 简单的请求头解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成请求头
 */
export const simpleRequestHeaderResolver: RequestHeaderResolver = (apiService: FeignProxyClient,
                                                                   methodName: string,
                                                                   headers: Record<string, string>,
                                                                   data: UriVariable): Record<string, string> => {

    const apiServiceConfig = apiService.getFeignMethodConfig(methodName);
    if (apiServiceConfig.requestMapping == null || apiServiceConfig.requestMapping.headers == null) {
        return headers;
    }

    const configHeaders = apiServiceConfig.requestMapping.headers;
    const uriVariablesIsArray = Array.isArray(data);
    const newHeaders = {
        ...(headers || {})
    };
    //marge headers
    for (const key in configHeaders) {
        const headerValue: string = configHeaders[key];
        configHeaders[key] = replacePathVariableValue(headerValue, data);
    }

    //return new headers
    return newHeaders;
};



