import { FeignRequestOptions } from "../FeignRequestOptions";
import { HttpRequestDataEncoder } from "./HttpRequestDataEncoder";
import { HttpResponseDataDecoder } from "./HttpResponseDataDecoder";
import { FeignClientExecutorInterceptor } from "../FeignClientExecutorInterceptor";
/**
 * codec executor interceptor
 */
export default class CodecFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions> implements FeignClientExecutorInterceptor<T> {
    protected encoders: HttpRequestDataEncoder<T>[];
    protected decoders: HttpResponseDataDecoder[];
    constructor(encoders?: HttpRequestDataEncoder<T>[], decoders?: HttpResponseDataDecoder[]);
    postHandle: <E = any>(options: T, response: E) => Promise<E>;
    preHandle: (options: T) => Promise<T>;
}
