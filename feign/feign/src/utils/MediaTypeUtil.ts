import {HttpMediaType} from "../constant/http/HttpMediaType";
import {contentTransferEncodingName, contentTypeName} from "../constant/FeignConstVar";


// const UTF_8 = ";charset=UTF-8";

/**
 * determine if two HttpMediaTypes are the same
 * @param type1
 * @param type2
 */
export const mediaTypeIsEq = (type1: HttpMediaType | string, type2: HttpMediaType | string) => {

    if (type1 == null || type2 == null) {
        return false;
    }

    if (type1 === type2) {
        return true;
    }
    // return type1.replace(UTF_8, "") === type2.replace(UTF_8, "");

    const [t1] = type1.split(";");
    const [t2] = type2.split(";");
    return t1 == t2;

};

export const responseIsJson = (headers: Record<string, string>) => {

    return mediaTypeIsEq(headers[contentTypeName], HttpMediaType.APPLICATION_JSON_UTF8)
};

export const responseIsText = (headers: Record<string, string>) => {
    if (mediaTypeIsEq(headers[contentTypeName], HttpMediaType.TEXT)) {
        return true;
    }
    return mediaTypeIsEq(headers[contentTypeName], HttpMediaType.HTML);
};

export const responseIsFile = (headers: Record<string, string>) => {

    if (mediaTypeIsEq(headers[contentTypeName], HttpMediaType.APPLICATION_JSON_UTF8)) {
        return true;
    }

    return mediaTypeIsEq(headers[contentTransferEncodingName], 'binary')
};
