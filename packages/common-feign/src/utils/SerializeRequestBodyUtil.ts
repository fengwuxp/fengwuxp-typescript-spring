import {ParsedUrlQueryInput} from "querystring";
import {HttpRequestBody} from "../client/HttpClient";
import {HttpMediaType} from "../constant/http/HttpMediaType";
import {HttpMethod} from "../constant/HttpMethod";
import {mediaTypeIsEq} from "./MediaTypeUtil";


/**
 * serialize http request body for content type
 *
 * @param method
 * @param body
 * @param contentType
 * @param filterNoneValue  filter none value
 */
export const serializeRequestBody = (method: string,
                                     body: HttpRequestBody | string,
                                     contentType: HttpMediaType,
                                     filterNoneValue: boolean = true): string => {

    if (method !== HttpMethod.POST && method !== HttpMethod.PUT && method !== HttpMethod.PATCH) {
        return body as any
    }
    if (body == null || contentType == null) {
        return body as any
    }

    if (typeof body === "string") {
        return body;
    }

    if (mediaTypeIsEq(contentType, HttpMediaType.FORM_DATA)) {
        // form data
        return queryStringify(body, filterNoneValue);
    }
    if (mediaTypeIsEq(contentType, HttpMediaType.APPLICATION_JSON_UTF8)) {
        // json data
        return JSON.stringify(filterNoneValue ? body : filterNoneValueAndNewObject(body));
    }

    throw new Error("");
};

const filterNoneValueAndNewObject = (body: Record<string, any>) => {
    const newData = {};
    for (const key in body) {
        const value = body[key];
        const isFilter = value == null || isNoneNumber(value) || isNoneString(value);
        if (isFilter) {
            continue;
        }
        newData[key] = value;
    }
    return newData;
};

const stringifyPrimitive = function (v) {
    switch (typeof v) {
        case 'string':
            return v;

        case 'boolean':
            return v ? 'true' : 'false';

        case 'number':
            return isFinite(v) ? v : '';

        default:
            return '';
    }
};

const isNoneNumber = (val) => typeof val === "number" && isNaN(val);
const isNoneString = (val) => typeof val === "string" && val.trim().length === 0;

/**
 * assemble the query string
 *
 * @param obj
 * @param filterNoneValue
 * @param sep
 * @param eq
 * @param name
 */
export const queryStringify = (obj: ParsedUrlQueryInput,
                               filterNoneValue: boolean = true,
                               sep?: string,
                               eq?: string,
                               name?: string): string => {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
        obj = undefined;
    }

    if (typeof obj === 'object') {
        return Object.keys(obj).map(function (key) {
            const value = obj[key];
            if (filterNoneValue) {
                if (value == null) {
                    return;
                }
                if (isNoneNumber(value)) {
                    return;
                }
                if (isNoneString(value)) {
                    return;
                }
            }
            const ks = `${encodeURIComponent(stringifyPrimitive(key))}${eq}`;
            if (Array.isArray(value)) {
                if (value.length == 0) {
                    return;
                }
                // key=1,2,3
                return `${ks}${value.join(",")}`;

            } else {
                return `${ks}${encodeURIComponent(stringifyPrimitive(value))}`;
            }
        }).filter(val => {
            return val != null;
        }).join(sep);

    }

    if (!name) {
        return '';
    }
    return `${encodeURIComponent(stringifyPrimitive(name))}${eq}${encodeURIComponent(stringifyPrimitive(obj))}`;

};
