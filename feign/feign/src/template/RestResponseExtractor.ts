import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/http/HttpMethod";
import {ResponseExtractor} from "./ResponseExtractor";


/**
 * void response extractor
 * @param response
 */
export const voidResponseExtractor = (response: HttpResponse): Promise<void> => {
    if (response.ok) {
        return Promise.resolve();
    }
    return Promise.reject(response);
};

/**
 * object response extractor
 * @param response
 */
export const objectResponseExtractor: ResponseExtractor<any> = <E = any>(response: HttpResponse): Promise<E> => {
    if (response.ok) {
        return Promise.resolve(response.data);
    }
    return Promise.reject(response);
};

/**
 * head response extractor
 * @param response
 */
export const headResponseExtractor = (response: HttpResponse): Promise<Record<string, string>> => {

    return Promise.resolve(response.headers);
};

/**
 * options method response extractor
 * @param response
 */
export const optionsMethodResponseExtractor = (response: HttpResponse): Promise<HttpMethod[]> => {


    if (response.ok) {
        const methods: HttpMethod[] = response.headers["Access-Control-Allow-Methods"].split(",") as HttpMethod[];
        return Promise.resolve(methods);
    }
    return Promise.reject(response);
};

/**
 *
 * @param method
 */
export const restResponseExtractor = (method: HttpMethod) => {
    switch (method) {
        case HttpMethod.GET:
            return objectResponseExtractor;
        case HttpMethod.POST:
            return objectResponseExtractor;
        case HttpMethod.PATCH:
            return objectResponseExtractor;
        case HttpMethod.DELETE:
            return voidResponseExtractor;
        case HttpMethod.OPTIONS:
            return optionsMethodResponseExtractor;
        case HttpMethod.HEAD:
            return headResponseExtractor;
        case HttpMethod.PUT:
            return objectResponseExtractor;
    }
};
