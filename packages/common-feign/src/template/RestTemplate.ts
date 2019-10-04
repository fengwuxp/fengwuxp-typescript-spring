import {RestOperations, UriVariable} from "./RestOperations";
import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/HttpMethod";
import {ResponseExtractor, ResponseExtractorFunction} from "./ResponseExtractor";
import {
    headResponseExtractor,
    objectResponseExtractor,
    optionsMethodResponseExtractor,
    voidResponseExtractor
} from "./DefaultResponseExtractor";
import {HttpClient} from "../client/HttpClient";
import {UriTemplateHandler, UriTemplateHandlerFunction, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {defaultUriTemplateFunctionHandler} from "./DefaultUriTemplateHandler";
import {ResponseErrorHandler, ResponseErrorHandlerFunction} from "./ResponseErrorHandler";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";

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

    patchForObject = <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<E> => {
        return this.execute(url, HttpMethod.PATCH, uriVariables, request, objectResponseExtractor, headers);
    };

    postForEntity = <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<HttpResponse<E>> => {
        return this.execute(url, HttpMethod.POST, uriVariables, request, null, headers);
    };

    postForLocation = (url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<string> => {
        return this.execute(url, HttpMethod.POST, uriVariables, request, objectResponseExtractor, headers);
    };

    postForObject = <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<E> => {
        return this.execute(url, HttpMethod.POST, uriVariables, request, objectResponseExtractor, headers);
    };

    put = (url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>): Promise<void> => {
        return this.execute(url, HttpMethod.PUT, uriVariables, request, objectResponseExtractor, headers);
    };

    execute = async <E = any>(url: string,
                              method: HttpMethod,
                              uriVariables?: UriVariable,
                              request?: any,
                              responseExtractor?: ResponseExtractor<E>,
                              headers?: Record<string, string>): Promise<E> => {


        // handle url and query params
        const {_uriTemplateHandler, _responseErrorHandler,} = this;
        const realUrl = invokeFunctionInterface<UriTemplateHandler, UriTemplateHandlerFunction>(_uriTemplateHandler)(url, uriVariables);

        let httpResponse;
        try {
            httpResponse = await this.httpClient.send({
                url: realUrl,
                method,
                body: request,
                headers
            });
        } catch (error) {
            //handle error
            console.log("http error", error);
            if (_responseErrorHandler) {
                return invokeFunctionInterface<ResponseErrorHandler, ResponseErrorHandlerFunction<E>>(_responseErrorHandler)(error);
            }

        }

        if (responseExtractor) {
            return invokeFunctionInterface<ResponseExtractor, ResponseExtractorFunction>(responseExtractor)(httpResponse);
        }

        return httpResponse;

    };


    set uriTemplateHandler(value: UriTemplateHandlerInterface | ((uriTemplate: string, uriVariables: UriVariable) => string)) {
        this._uriTemplateHandler = value;
    }

    set responseErrorHandler(value: ResponseErrorHandler | ((response: HttpResponse<any>) => (Promise | any))) {
        this._responseErrorHandler = value;
    }
}
