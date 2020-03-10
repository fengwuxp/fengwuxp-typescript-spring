import {FeignClientMethodConfig} from "../support/FeignClientMethodConfig";


// mapping option cache
const MAPPING_CACHE: Map<string/*request id or url and method*/, FeignClientMethodConfig> = new Map<string, FeignClientMethodConfig>();


/**
 * 设置上下文
 * @param requestId
 * @param context
 */
export const setRequestContext = (requestId: string, context: Readonly<FeignClientMethodConfig>) => {

    MAPPING_CACHE.set(requestId, context);
};



/**
 * 移除上下文
 * @param requestId
 */
export const removeRequestContext = (requestId: string) => {

    MAPPING_CACHE.delete(requestId);

};

export const getFeignClientMethodConfiguration = (requestId: string): Readonly<FeignClientMethodConfig> => {

    return MAPPING_CACHE.get(requestId);

};
