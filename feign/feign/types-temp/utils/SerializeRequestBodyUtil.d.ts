/// <reference types="node" />
import { ParsedUrlQueryInput } from "querystring";
import { HttpRequestBody } from "../client/HttpClient";
import { HttpMediaType } from "../constant/http/HttpMediaType";
export declare const supportRequestBody: (method: string) => boolean;
/**
 * serialize http request body for content type
 *
 * @param method
 * @param body
 * @param contentType
 * @param filterNoneValue  filter none value
 */
export declare const serializeRequestBody: (method: string, body: HttpRequestBody, contentType: HttpMediaType, filterNoneValue?: boolean) => string;
export declare const filterNoneValueAndNewObject: (body: Record<string, any>) => {};
/**
 * assemble the query string
 *
 * @param obj
 * @param filterNoneValue
 * @param sep
 * @param eq
 * @param name
 */
export declare const queryStringify: (obj: ParsedUrlQueryInput, filterNoneValue?: boolean, sep?: string, eq?: string, name?: string) => string;
