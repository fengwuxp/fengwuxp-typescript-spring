import {FeignRequestOptions} from "../FeignRequestOptions";
import {FeignClientExecutorInterceptor} from "../FeignClientExecutorInterceptor";
import {HttpResponse} from '../client/HttpResponse';
import {RequestTracer} from './RequestTracer';


/**
 * used to track requests
 */
export default class TraceRequestExecutorInterceptor<T extends FeignRequestOptions = FeignRequestOptions>
    implements FeignClientExecutorInterceptor<T> {

    private requestTracer: RequestTracer;

    constructor(requestTracer: Partial<RequestTracer>) {
        this.requestTracer = TraceRequestExecutorInterceptor.wrapperRequestTracer(requestTracer);
    }

    postError = (options: T, response: HttpResponse) => {
        this.requestTracer.onError(options, response);
        return Promise.reject(response);
    }

    postHandle = <E>(options: T, response: E) => {
        this.requestTracer.onSuccess(options, response);
        return Promise.resolve(response)
    }

    preHandle = (options: T): Promise<T> | T => {
        try {
            this.requestTracer.onRequest(options);
        } catch (_) {
            // ignore tracer request error
        }
        return options;
    }

    private static wrapperRequestTracer = (requestTracer: Partial<RequestTracer>): RequestTracer => {

        return {
            onRequest: (req) => {
                requestTracer?.onRequest?.(req);
            },
            onSuccess: (options, response) => {
                requestTracer?.onSuccess?.(options, response);
            },
            onError: (options, response) => {
                requestTracer?.onError?.(options, response);
            }
        }
    }


}