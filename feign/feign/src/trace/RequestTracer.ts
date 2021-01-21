import {FeignRequestOptions} from "../FeignRequestOptions";
import {HttpResponse} from "../client/HttpResponse";

/**
 * request tracer
 */
export interface RequestTracer {

    onRequest: (req: FeignRequestOptions) => void;

    onSuccess: (options: FeignRequestOptions, response: any) => void;

    onError: (options: FeignRequestOptions, response: HttpResponse) => void;

}