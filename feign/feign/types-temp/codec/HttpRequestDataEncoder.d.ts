import { FeignRequestOptions } from "../FeignRequestOptions";
/**
 *  request data encoder
 */
export interface HttpRequestDataEncoder<T extends FeignRequestOptions = FeignRequestOptions> {
    /**
     * encode
     * @param request
     * @param otherArgs 其他参数
     */
    encode: (request: T) => Promise<T>;
}
