import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {HttpRequestContext} from "../client/HttpRequest";


const REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME = "requestMethodConfig";


export const setFeignClientMethodConfiguration = (context: HttpRequestContext, config: Readonly<FeignClientMethodConfig>) => {
    context.attributes[REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME] = config;
}

/**
 * 通过请求上下文id 获取FeignClientMethodConfig
 */
export const getFeignClientMethodConfiguration = (context: HttpRequestContext): Readonly<FeignClientMethodConfig> => {
    return context.attributes[REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME];
};

