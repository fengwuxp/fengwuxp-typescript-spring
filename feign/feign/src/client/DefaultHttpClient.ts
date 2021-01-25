import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName} from "../constant/FeignConstVar";
import {ClientHttpRequestInterceptor, ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {AbstractHttpClient} from "./AbstractHttpClient";
import {HttpMediaType} from "../constant/http/HttpMediaType";
import {HttpStatus} from "../constant/http/HttpStatus";
import MappedClientHttpRequestInterceptor from "../interceptor/MappedClientHttpRequestInterceptor";
import {removeRequestContextId} from "../context/RequestContextHolder";

/**
 * default http client
 * Provides support for common HTTP method requests
 * Retry if needed {@see RetryHttpClient}
 */
export default class DefaultHttpClient<T extends HttpRequest = HttpRequest> extends AbstractHttpClient<T> {


    /**
     * In order to support different js runtime environments, the following parameters need to be provided
     * @param httpAdapter           Request adapters for different platforms
     * @param defaultProduce
     * @param interceptors
     */
    constructor(httpAdapter: HttpAdapter<T>,
                defaultProduce?: HttpMediaType,
                interceptors?: Array<ClientHttpRequestInterceptor<T>>) {
        super(httpAdapter, defaultProduce, interceptors);
    }

    send = async (req: T): Promise<HttpResponse> => {
        const {interceptors} = this;
        const len = interceptors.length;
        let index = 0;
        let httpRequest: T = req;
        while (index < len) {
            const interceptor = interceptors[index];
            index++;
            if (interceptor instanceof MappedClientHttpRequestInterceptor) {
                if (!interceptor.matches(httpRequest)) {
                    continue;
                }
            }
            const clientHttpRequestInterceptorInterface = invokeFunctionInterface<ClientHttpRequestInterceptor<T>, ClientHttpRequestInterceptorInterface<T>>(interceptor);
            try {
                httpRequest = await clientHttpRequestInterceptorInterface.interceptor(httpRequest);
            } catch (e) {
                // error ignore
                console.error("http request interceptor handle exception", e);
                // Interrupt request
                if (e != null && e.statusCode != null && e.ok !== null) {
                    return Promise.reject(e);
                }
                //  mock error response
                return Promise.reject({
                    ok: false,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    statusText: null,
                    data: e
                });
            }
        }

        const contentType = this.resolveContentType(httpRequest);
        httpRequest.body = serializeRequestBody(httpRequest.method, httpRequest.body, contentType as HttpMediaType, false);
        removeRequestContextId(httpRequest);
        return this.httpAdapter.send(httpRequest);
    };

    private resolveContentType = (requestData: T) => {

        let headers = requestData.headers;
        let contentType = this.defaultProduce;
        if (headers == null) {
            headers = {};
        } else {
            contentType = headers[contentTypeName] as HttpMediaType || contentType;
        }
        headers[contentTypeName] = contentType;
        requestData.headers = headers;
        return contentType;
    }

}
