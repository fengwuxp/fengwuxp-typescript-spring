import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";
import {HttpRequest} from "../client/HttpRequest";
import {REQUEST_ID_HEADER_NAME} from '../constant/FeignConstVar';
import {FeignRequestOptions} from "../FeignRequestOptions";


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


// 自增长的request context id序列
let REQUEST_NUM = 0;

/**
 * 添加请求上下文的Id
 * @param feignRequestOptions
 * @return string  request context id
 */
export const appendRequestContextId = (feignRequestOptions: FeignRequestOptions): string => {
    const requestId = `${REQUEST_NUM++}`;
    feignRequestOptions.requestId = requestId;
    feignRequestOptions.headers[REQUEST_ID_HEADER_NAME] = requestId;
    return requestId;
};

/**
 * 通过请求上下文id 获取FeignClientMethodConfig
 * @param req
 * {@link REQUEST_NUM}
 * {@link appendRequestContextId}
 * {@link REQUEST_ID_HEADER_NAME}
 * {@link FeignClientMethodConfig}
 */
export const getFeignClientMethodConfigurationByRequest = (req: HttpRequest): Readonly<FeignClientMethodConfig> => {
    const headers = req.headers;
    if (headers == null) {
        return null;
    }

    return getFeignClientMethodConfiguration(headers[REQUEST_ID_HEADER_NAME])
};

