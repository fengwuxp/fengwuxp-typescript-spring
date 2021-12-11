import {RequestHeaderResolver} from "./RequestHeaderResolver";
import {FeignProxyClient} from "../../support/FeignProxyClient";
import {contentTypeName} from "../../constant/FeignConstVar";
import {UriVariable} from "../../template/RestOperations";
import {replacePathVariableValue} from "../../helper/ReplaceUriVariableHelper";


/**
 * 简单的请求头解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成请求头
 */
export const simpleRequestHeaderResolver: RequestHeaderResolver = (apiService: FeignProxyClient,
                                                                   methodName: string,
                                                                   headers: Record<string, string>,
                                                                   data?: UriVariable): Record<string, string> => {

    const apiServiceConfig = apiService.getFeignMethodConfig(methodName);
    const requestMapping = apiServiceConfig.requestMapping;
    if (requestMapping == null || data == null) {
        return headers ?? {};
    }
    const newHeaders = {...headers};
    const mappingHeaders = requestMapping.headers;

    // marge headers
    for (const key in mappingHeaders) {
        const headerValue = mappingHeaders[key];
        if (headerValue == null || newHeaders[key] != null) {
            // key不存在 或 已经解析过了
            continue;
        }

        if (typeof headerValue === "string") {
            newHeaders[key] = replacePathVariableValue(headerValue, data);
        } else if (Array.isArray(headerValue)) {
            newHeaders[key] = headerValue.join(";");
        } else {
            newHeaders[key] = headerValue + "";
        }
    }
    const produces = requestMapping.produces;
    if (produces != null) {
        newHeaders[contentTypeName] = produces[0];
    }

    return newHeaders;
};



