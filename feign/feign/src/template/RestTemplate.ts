import {RestOperations, UriVariable} from "./RestOperations";
import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/http/HttpMethod";
import {BusinessResponseExtractorFunction, ResponseExtractor, ResponseExtractorInterface} from "./ResponseExtractor";
import {
    DEFAULT_BUSINESS_EXTRACTOR,
    headResponseExtractor,
    objectResponseExtractor,
    optionsMethodResponseExtractor
} from "./RestResponseExtractor";
import {HttpClient} from "../client/HttpClient";
import {UriTemplateHandler, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {defaultUriTemplateFunctionHandler} from "./DefaultUriTemplateHandler";
import {ResponseErrorHandler, ResponseErrorHandlerInterFace} from "./ResponseErrorHandler";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {replacePathVariableValue} from "../helper/ReplaceUriVariableHelper";
import {HttpRequestContext} from "../client/HttpRequest";
import {getRequestRetryOptions} from "../context/RequestContextHolder";
import RetryHttpClient from "../client/RetryHttpClient";

/**
 *  http rest template
 */
export default class RestTemplate implements RestOperations {


    private readonly httpClient: HttpClient;

    private _uriTemplateHandler: UriTemplateHandler = defaultUriTemplateFunctionHandler;

    private _responseErrorHandler: ResponseErrorHandler;

    private businessResponseExtractor: BusinessResponseExtractorFunction;

    constructor(httpClient: HttpClient, businessResponseExtractor?: BusinessResponseExtractorFunction) {
        this.httpClient = httpClient;
        this.businessResponseExtractor = businessResponseExtractor || DEFAULT_BUSINESS_EXTRACTOR;
    }

    delete = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<void> => {

        return this.execute(url, HttpMethod.DELETE, uriVariables, null, objectResponseExtractor, headers, context);
    };

    getForEntity = <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<HttpResponse<E>> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, null, headers, context);
    };

    getForObject = <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<E> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, objectResponseExtractor, headers, context);
    };

    headForHeaders = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<Record<string, string>> => {
        return this.execute(url, HttpMethod.HEAD, uriVariables, null, headResponseExtractor, headers, context);
    };

    optionsForAllow = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<HttpMethod[]> => {
        return this.execute(url, HttpMethod.OPTIONS, uriVariables, null, optionsMethodResponseExtractor, headers, context);
    };

    patchForObject = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<E> => {
        return this.execute(url, HttpMethod.PATCH, uriVariables, requestBody, objectResponseExtractor, headers, context);
    };

    postForEntity = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<HttpResponse<E>> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, null, headers, context);
    };

    postForLocation = (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<string> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, objectResponseExtractor, headers, context);
    };

    postForObject = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<E> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, objectResponseExtractor, headers, context);
    };

    put = (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>, context?: HttpRequestContext): Promise<void> => {
        return this.execute(url, HttpMethod.PUT, uriVariables, requestBody, objectResponseExtractor, headers, context);
    };

    execute = async <E = any>(url: string,
                              method: HttpMethod,
                              uriVariables?: UriVariable,
                              requestBody?: any,
                              responseExtractor?: ResponseExtractor<E>,
                              headers?: Record<string, string>,
                              context?: HttpRequestContext): Promise<E> => {


        // handle url and query params
        const {_uriTemplateHandler, _responseErrorHandler, businessResponseExtractor} = this;

        //handling path parameters in the request body, if any
        const requestUrl = invokeFunctionInterface<UriTemplateHandler, UriTemplateHandlerInterface>(_uriTemplateHandler)
            .expand(replacePathVariableValue(url, requestBody), uriVariables);

        let httpClient = this.httpClient;
        const requestRetryOptions = getRequestRetryOptions(context);
        if (requestRetryOptions != null) {
            // retry client
            httpClient = new RetryHttpClient(httpClient, requestRetryOptions);
        }

        let httpResponse;
        const contextAttributes = context?.attributes ?? {};
        try {
            httpResponse = await httpClient.send({
                url: requestUrl,
                method,
                body: requestBody,
                headers,
                attributes: contextAttributes
            });
        } catch (error) {
            //handle error
            if (_responseErrorHandler) {
                return invokeFunctionInterface<ResponseErrorHandler, ResponseErrorHandlerInterFace>(_responseErrorHandler).handleError(
                    {
                        url: requestUrl,
                        method,
                        headers,
                        body: requestBody,
                        attributes: contextAttributes
                    }, error);
            }

            return Promise.reject(error);

        }

        if (responseExtractor) {
            return invokeFunctionInterface<ResponseExtractor<E>, ResponseExtractorInterface<E>>(responseExtractor).extractData(httpResponse, businessResponseExtractor);
        }

        return httpResponse;

    };


    set uriTemplateHandler(uriTemplateHandler: UriTemplateHandler) {
        this._uriTemplateHandler = uriTemplateHandler;
    }

    set responseErrorHandler(responseErrorHandler: ResponseErrorHandler) {
        this._responseErrorHandler = responseErrorHandler;
    }
}
