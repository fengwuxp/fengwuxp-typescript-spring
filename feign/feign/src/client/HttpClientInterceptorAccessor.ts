import {ClientHttpRequestInterceptor} from "./ClientHttpRequestInterceptor";


/**
 * {@see ClientHttpRequestInterceptor} accessor
 */
export interface HttpClientInterceptorAccessor {


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
