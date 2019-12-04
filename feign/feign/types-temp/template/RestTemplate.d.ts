import { RestOperations, UriVariable } from "./RestOperations";
import { HttpResponse } from "../client/HttpResponse";
import { HttpMethod } from "../constant/http/HttpMethod";
import { ResponseExtractor } from "./ResponseExtractor";
import { HttpClient } from "../client/HttpClient";
import { UriTemplateHandler } from "./UriTemplateHandler";
import { ResponseErrorHandler } from "./ResponseErrorHandler";
/**
 *  http rest template
 */
export default class RestTemplate implements RestOperations {
    private httpClient;
    private _uriTemplateHandler;
    private _responseErrorHandler;
    constructor(httpClient: HttpClient);
    delete: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    getForEntity: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    getForObject: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    headForHeaders: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<Record<string, string>>;
    optionsForAllow: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpMethod[]>;
    patchForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    postForEntity: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;
    postForLocation: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<string>;
    postForObject: <E = any>(url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;
    put: (url: string, requestBody: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;
    execute: <E = any>(url: string, method: HttpMethod, uriVariables?: UriVariable, requestBody?: any, responseExtractor?: ResponseExtractor<E>, headers?: Record<string, string>) => Promise<E>;
    set uriTemplateHandler(uriTemplateHandler: UriTemplateHandler);
    set responseErrorHandler(responseErrorHandler: ResponseErrorHandler);
}
