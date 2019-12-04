import { HttpResponse } from "../client/HttpResponse";
/**
 * resolve response data converter to HttpResponse
 */
export interface ResolveHttpResponse<T = any> {
    resolve: (data: T) => HttpResponse;
}
