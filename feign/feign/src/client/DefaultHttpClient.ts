import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";
import {serializeRequestBody} from "../utils/SerializeRequestBodyUtil";
import {contentTypeName, REQUEST_ID_HEADER_NAME} from "../constant/FeignConstVar";
import {ClientHttpRequestInterceptor, ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {AbstractHttpClient} from "./AbstractHttpClient";
import {HttpMediaType} from "../constant/http/HttpMediaType";
import {HttpStatus} from "../constant/http/HttpStatus";
import MappedClientHttpRequestInterceptor from "../interceptor/MappedClientHttpRequestInterceptor";

/**
 * default http client
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
        let requestData: T = req;
        while (index < len) {
            const interceptor = interceptors[index];
            index++;
            if (interceptor instanceof MappedClientHttpRequestInterceptor) {
                if (!interceptor.matches(requestData)) {
                    continue;
                }
            }
            const clientHttpRequestInterceptorInterface = invokeFunctionInterface<ClientHttpRequestInterceptor<T>, ClientHttpRequestInterceptorInterface<T>>(interceptor);
            try {
                requestData = await clientHttpRequestInterceptorInterface.interceptor(requestData);
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

        const contentType = this.resolveContentType(requestData);
        requestData.body = serializeRequestBody(requestData.method, requestData.body, contentType as HttpMediaType, false);
        if (requestData.headers != null) {
            delete requestData.headers[REQUEST_ID_HEADER_NAME];
        }
        return this.httpAdapter.send(requestData);
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
