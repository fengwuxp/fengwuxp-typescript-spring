import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {HttpRequestContext} from "../client/HttpRequest";
import {HttpRetryOptions} from "../client/HttpRetryOptions";


const REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME = "REQUEST_METHOD_REFLECT_ATTRIBUTE";

export const setFeignClientMethodConfiguration = (context: HttpRequestContext, config: Readonly<FeignClientMethodConfig>) => {
    context.attributes[REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME] = config;
}

/**
 * 通过请求上下文 获取 {@link FeignClientMethodConfig}
 */
export const getFeignClientMethodConfiguration = (context: HttpRequestContext): Readonly<FeignClientMethodConfig> => {
    return context.attributes[REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME];
};


/**
 * 通过请求上下文 获取 {@link HttpRetryOptions}
 */
export const getRequestRetryOptions = (context: HttpRequestContext): Readonly<HttpRetryOptions> => {
    return getFeignClientMethodConfiguration(context)?.retryOptions;
};

