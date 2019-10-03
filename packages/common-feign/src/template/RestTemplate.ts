import {RestOperations, UriVariable} from "./RestOperations";
import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/HttpMethod";
import {RestOperationOptions} from "./RestOperationOptions";
import {ResponseExtractor} from "./ResponseExtractor";
import {
    headResponseExtractor,
    objectResponseExtractor,
    optionsMethodResponseExtractor,
    voidResponseExtractor
} from "./DefaultResponseExtractor";
import {HttpClient} from "../client/HttpClient";
import {UriTemplateHandler, UriTemplateHandlerFunction, UriTemplateHandlerInterface} from "./UriTemplateHandler";

/**
 *  http rest template
 */
export default class RestTemplate implements RestOperations {


    private httpClient: HttpClient;

    private uriTemplateHandler: UriTemplateHandler;

    delete = (url: string, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<void> => {

        return this.execute(url, HttpMethod.DELETE, uriVariables, null, voidResponseExtractor, options);
    };

    getForEntity = <E = any>(url: string, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<HttpResponse<E>> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, null, options);
    };

    getForObject = <E = any>(url: string, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<E> => {

        return this.execute(url, HttpMethod.GET, uriVariables, null, objectResponseExtractor, options);
    };

    headForHeaders = (url: string, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<Record<string, string>> => {
        return this.execute(url, HttpMethod.HEAD, uriVariables, null, headResponseExtractor, options);
    };
    optionsForAllow = (url: string, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<HttpMethod[]> => {
        return this.execute(url, HttpMethod.OPTIONS, uriVariables, null, optionsMethodResponseExtractor, options);
    };

    patchForObject = <E = any>(url: string, request: any, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<E> => {
        return this.execute(url, HttpMethod.PATCH, uriVariables, request, objectResponseExtractor, options);
    };

    postForEntity = <E = any>(url: string, request: any, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<HttpResponse<E>> => {
        return this.execute(url, HttpMethod.PATCH, uriVariables, request, null, options);
    };

    postForLocation = (url: string, request: any, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<string> => {
        return this.execute(url, HttpMethod.POST, uriVariables, request, objectResponseExtractor, options);
    };

    postForObject = <E = any>(url: string, request: any, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<E> => {
        return this.execute(url, HttpMethod.POST, uriVariables, request, objectResponseExtractor, options);
    };

    put = (url: string, request: any, uriVariables?: UriVariable, options?: RestOperationOptions): Promise<void> => {
        return this.execute(url, HttpMethod.PUT, uriVariables, request, objectResponseExtractor, options);
    };

    execute = <E = any>(url: string,
                        method: HttpMethod,
                        uriVariables?: UriVariable,
                        request?: any,
                        responseExtractor?: ResponseExtractor<E>,
                        options?: RestOperationOptions): Promise<E> => {


        let realUrl = url;

        const uriTemplateHandler = this.uriTemplateHandler;
        if (typeof uriTemplateHandler === "function") {
            realUrl = uriTemplateHandler(url, uriVariables);
        } else {
            realUrl = (uriTemplateHandler as UriTemplateHandlerInterface).expand(url, uriVariables);
        }


        return this.httpClient.send({
            url: realUrl,
            method,
            body: request,

        }) as any;

    };


}
