import {RestOperations, UriVariable} from "./RestOperations";
import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/http/HttpMethod";
import {ResponseExtractor, ResponseExtractorInterface} from "./ResponseExtractor";
import {
    headResponseExtractor,
    objectResponseExtractor,
    optionsMethodResponseExtractor,
    voidResponseExtractor
} from "./RestResponseExtractor";
import {HttpClient} from "../client/HttpClient";
import {UriTemplateHandler, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {defaultUriTemplateFunctionHandler} from "./DefaultUriTemplateHandler";
import {ResponseErrorHandler, ResponseErrorHandlerInterFace} from "./ResponseErrorHandler";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import {replacePathVariableValue} from "../helper/ReplaceUriVariableHelper";

/**
 *  http rest template
 */
export default class RestTemplate implements RestOperations {


    private httpClient: HttpClient;

    private _uriTemplateHandler: UriTemplateHandler = defaultUriTemplateFunctionHandler;

    private _responseErrorHandler: ResponseErrorHandler;


    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    delete = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<void> => {

        return this.execute(url, HttpMethod.DELETE, uriVariables, null, voidResponseExtractor, headers);
    };

    getForEntity = <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<HttpResponse<E>> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, null, headers);
    };

    getForObject = <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<E> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, objectResponseExtractor, headers);
    };

    headForHeaders = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<Record<string, string>> => {
        return this.execute(url, HttpMethod.HEAD, uriVariables, null, headResponseExtractor, headers);
    };

    optionsForAllow = (url: string, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<HttpMethod[]> => {
        return this.execute(url, HttpMethod.OPTIONS, uriVariables, null, optionsMethodResponseExtractor, headers);
    };

    patchForObject = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<E> => {
        return this.execute(url, HttpMethod.PATCH, uriVariables, requestBody, objectResponseExtractor, headers);
    };

    postForEntity = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<HttpResponse<E>> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, null, headers);
    };

    postForLocation = (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<string> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, objectResponseExtractor, headers);
    };

    postForObject = <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<E> => {
        return this.execute(url, HttpMethod.POST, uriVariables, requestBody, objectResponseExtractor, headers);
    };

    put = (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<void> => {
        return this.execute(url, HttpMethod.PUT, uriVariables, requestBody, objectResponseExtractor, headers);
    };

    execute = async <E = any>(url: string,
                              method: HttpMethod,
                              uriVariables?: UriVariable,
                              requestBody?: any,
                              responseExtractor?: ResponseExtractor<E>,
                              headers?: Record<string, string>): Promise<E> => {


        // handle url and query params
        const {_uriTemplateHandler, _responseErrorHandler,} = this;

        //handling path parameters in the request body, if any
        let realUrl = replacePathVariableValue(url, requestBody);
        realUrl = invokeFunctionInterface<UriTemplateHandler, UriTemplateHandlerInterface>(_uriTemplateHandler).expand(realUrl, uriVariables);

        let httpResponse;
        try {
            httpResponse = await this.httpClient.send({
                url: realUrl,
                method,
                body: requestBody,
                headers
            });
        } catch (error) {
            //handle error
            if (_responseErrorHandler) {
                return invokeFunctionInterface<ResponseErrorHandler, ResponseErrorHandlerInterFace>(_responseErrorHandler).handleError(
                    {
                        url: realUrl,
                        method,
                        headers,
                        body: requestBody
                    },
                    error);
            }

            return Promise.reject(error);

        }

        if (responseExtractor) {
            return invokeFunctionInterface<ResponseExtractor<E>, ResponseExtractorInterface<E>>(responseExtractor).extractData(httpResponse);
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
