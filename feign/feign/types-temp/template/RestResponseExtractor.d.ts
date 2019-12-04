import { HttpResponse } from "../client/HttpResponse";
import { HttpMethod } from "../constant/http/HttpMethod";
import { ResponseExtractor } from "./ResponseExtractor";
/**
 * void response extractor
 * @param response
 */
export declare const voidResponseExtractor: (response: HttpResponse<any>) => Promise<void>;
/**
 * object response extractor
 * @param response
 */
export declare const objectResponseExtractor: ResponseExtractor<any>;
/**
 * head response extractor
 * @param response
 */
export declare const headResponseExtractor: (response: HttpResponse<any>) => Promise<Record<string, string>>;
/**
 * options method response extractor
 * @param response
 */
export declare const optionsMethodResponseExtractor: (response: HttpResponse<any>) => Promise<HttpMethod[]>;
/**
 *
 * @param method
 */
export declare const restResponseExtractor: (method: HttpMethod) => import("./ResponseExtractor").ResponseExtractorFunction<any>;
