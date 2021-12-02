import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {HttpRequestContext} from "../client/HttpRequest";
import {HttpRetryOptions} from "../client/HttpRetryOptions";
import {FeignConfiguration} from "../configuration/FeignConfiguration";


const REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME = "REQUEST_METHOD_REFLECT_ATTRIBUTE";

const REQUEST_FEIGN_CONFIG_ATTRIBUTE_NAME = "REQUEST_FEIGN_CONFIG";

const setAttribute = (context: HttpRequestContext, key: string, value: any) => {
    if (context.attributes == null) {
        context.attributes = {};
    }
    context.attributes[key] = value;
}

const getAttribute = <T>(context: HttpRequestContext, key: string): T | null => {
    if (context.attributes == null) {
        return null;
    }
    return context.attributes[key];
}

export const setRequestFeignConfiguration = (context: HttpRequestContext, feignConfig: Readonly<FeignConfiguration>) => {
    setAttribute(context, REQUEST_FEIGN_CONFIG_ATTRIBUTE_NAME, feignConfig);
}

/**
 * 通过请求上下文 获取 {@link FeignConfiguration}
 */
export const getRequestFeignConfiguration = (context: HttpRequestContext): Readonly<FeignConfiguration> | null => {
    return getAttribute<Readonly<FeignConfiguration>>(context, REQUEST_FEIGN_CONFIG_ATTRIBUTE_NAME);
};

export const setRequestFeignClientMethodConfiguration = (context: HttpRequestContext, methodConfig: Readonly<FeignClientMethodConfig>) => {
    setAttribute(context, REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME, methodConfig);
}

/**
 * 通过请求上下文 获取 {@link FeignClientMethodConfig}
 */
export const getRequestFeignClientMethodConfiguration = (context: HttpRequestContext): Readonly<FeignClientMethodConfig> | null => {
    return getAttribute<Readonly<FeignClientMethodConfig>>(context, REQUEST_METHOD_MIRROR_ATTRIBUTE_NAME);
};


/**
 * 通过请求上下文 获取 {@link HttpRetryOptions}
 */
export const getRequestRetryOptions = (context: HttpRequestContext): Readonly<HttpRetryOptions> | null => {
    return getRequestFeignClientMethodConfiguration(context)?.retryOptions;
};

