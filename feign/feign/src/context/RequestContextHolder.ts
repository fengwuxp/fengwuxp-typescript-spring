import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {getNextRequestId, HttpRequest} from "../client/HttpRequest";
import {REQUEST_ID_HEADER_NAME} from '../constant/FeignConstVar';


// mapping option cache
const MAPPING_CACHE: Map<string/*request id or url and method*/, FeignClientMethodConfig> = new Map<string, FeignClientMethodConfig>();


/**
 * 设置上下文
 * @param requestId          请求上下文id  {@see appendRequestContextId}
 * @param context            请求上下文内容 {@see FeignClientMethodConfig}
 */
export const setRequestContext = (requestId: string, context: Readonly<FeignClientMethodConfig>) => {

    MAPPING_CACHE.set(requestId, context);
};


/**
 * 移除上下文
 * @param requestId   请求上下文id  {@see appendRequestContextId}
 */
export const removeRequestContext = (requestId: string) => {

    MAPPING_CACHE.delete(requestId);

};

/**
 * 获取请求上下文内容
 * @param requestId   请求上下文id  {@see appendRequestContextId}
 * @return {@see FeignClientMethodConfig}
 */
export const getFeignClientMethodConfiguration = (requestId: string): Readonly<FeignClientMethodConfig> => {
    return MAPPING_CACHE.get(requestId);

};


/**
 * 添加 requestId到请求头中
 * @param headers\
 * @param requestId
 */
export const appendRequestContextId = (headers: Record<string, string>, requestId: string = getNextRequestId()) => {
    if (headers != null) {
        headers[REQUEST_ID_HEADER_NAME] = requestId;
    }
    return headers;
}

/**
 * 移除请求头中的 {@link REQUEST_ID_HEADER_NAME}并返回 requestId
 * @param headers 请求头
 * @return string  request context id
 */
export const removeRequestContextId = (headers?: Record<string, string>): string => {

    if (headers != null) {
        const requestId = headers[REQUEST_ID_HEADER_NAME];
        delete headers[REQUEST_ID_HEADER_NAME];
        return requestId;
    }
    return getNextRequestId();
}

/**
 * 通过请求上下文id 获取FeignClientMethodConfig
 * @param req
 * {@link getNextRequestId}
 * {@link appendRequestContextId}
 * {@link REQUEST_ID_HEADER_NAME}
 * {@link FeignClientMethodConfig}
 */
export const getFeignClientMethodConfigurationByRequest = (req: HttpRequest): Readonly<FeignClientMethodConfig> => {
    return getFeignClientMethodConfiguration(req.requestId || req.headers[REQUEST_ID_HEADER_NAME]);
};

