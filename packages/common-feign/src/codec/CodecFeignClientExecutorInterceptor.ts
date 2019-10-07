import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutor";
import {HttpResponse} from "../client/HttpResponse";
import {HttpRequestDataEncoder} from "./HttpRequestDataEncoder";
import {HttpResponseDataDecoder} from "./HttpResponseDataDecoder";


/**
 * codec executor interceptor
 */
export default class CodecFeignClientExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    protected encoders: HttpRequestDataEncoder<T>[];
    protected decoders: HttpResponseDataDecoder[];


    constructor(encoders: HttpRequestDataEncoder<T>[], decoders: HttpResponseDataDecoder[]) {
        this.encoders = encoders;
        this.decoders = decoders;
    }

    postHandle = async <E = any>(options: T, response: E) => {
        const {decoders} = this;
        let result: E = response, len = decoders.length, index = 0;
        while (index < len) {
            const decoder = decoders[index];
            result = await decoder.decode(result);
            index++;
        }
        return result;
    };

    preHandle = async (options: T) => {
        const {encoders} = this;
        let result: T = options, len = encoders.length, index = 0;
        while (index < len) {
            const encoder = encoders[index];
            result = await encoder.encode(result);
            index++;
        }

        return result;

    }


}
