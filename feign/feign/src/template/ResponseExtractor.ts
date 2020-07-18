import {HttpResponse} from "../client/HttpResponse";

/**
 * Generic callback interface used by {@link RestTemplate}'s retrieval methods
 * Implementations of this interface perform the actual work of extracting data
 * from a {@link HttpResponse}, but don't need to worry about exception
 * handling or closing resources.
 *
 * <p>Used internally by the {@link RestTemplate}, but also useful for application code.
 *
 */
export interface ResponseExtractorInterface<T = any> {

    extractData: ResponseExtractorFunction<T>;
}


/**
 * Extract data from the given {@code HttpResponse} and return it.
 * @param response the HTTP response
 * @return the extracted data
 */
export type ResponseExtractorFunction<T = any> = (response: HttpResponse, businessAssert?: BusinessResponseExtractorFunction) => T | Promise<T> | null | undefined ;

export  type ResponseExtractor<T = any> = ResponseExtractorFunction<T> | ResponseExtractorInterface<T>


/**
 * Judge whether the business is successfully processed and capture the data results of business response
 * @param response Body the HTTP response
 * @return  if request business handle success return business data , else return {@link Promise#reject}
 */
export type BusinessResponseExtractorFunction<B = any, T = any> = (responseBody: B) => T | Promise<T> | null | undefined | void;