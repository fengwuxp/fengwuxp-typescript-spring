import {ClientHttpRequestInterceptor} from "./ClientHttpRequestInterceptor";


/**
 *
 */
export interface InterceptingHttpAccessor {


    /**
     * Set the request interceptors that this http client should use.
     * @param interceptors
     */
    setInterceptors: (interceptors: ClientHttpRequestInterceptor[]) => void;

    /**
     * Get the request interceptors
     */
    getInterceptors: () => ClientHttpRequestInterceptor[];
}
