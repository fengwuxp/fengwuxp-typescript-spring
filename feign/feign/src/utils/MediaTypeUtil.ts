import {HttpMediaType} from "../constant/http/HttpMediaType";
import {contentTransferEncodingName, contentTypeName} from "../constant/FeignConstVar";


// const UTF_8 = ";charset=UTF-8";

/**
 * determine if two HttpMediaTypes are the same
 * @param responseMediaType
 * @param expectMediaType
 */
export const matchMediaType = (responseMediaType: HttpMediaType | string, expectMediaType: HttpMediaType | string) => {

    if (responseMediaType == null || expectMediaType == null) {
        return false;
    }

    if (responseMediaType === expectMediaType) {
        return true;
    }
    const [t1] = responseMediaType.split(";");
    const [t2] = expectMediaType.split(";");
    return t1 == t2;
};

export const matchesMediaType = (responseMediaType: HttpMediaType | string, expectMediaTypes: Array<HttpMediaType | string>) => {
    return expectMediaTypes.map(expectMediaType => matchMediaType(responseMediaType, expectMediaType)).find(match => match);
};

export const responseIsJson = (headers: Record<string, string>) => {
    return matchesMediaType(headers[contentTypeName], [HttpMediaType.APPLICATION_JSON_UTF8, HttpMediaType.TEXT_JSON_UTF8]);
};

export const responseIsText = (headers: Record<string, string>) => {
    return matchesMediaType(headers[contentTypeName], [HttpMediaType.TEXT, HttpMediaType.HTML]);
};

export const responseIsFile = (headers: Record<string, string>) => {
    if (matchMediaType(headers[contentTypeName], HttpMediaType.APPLICATION_STREAM)) {
        return true;
    }
    return matchMediaType(headers[contentTransferEncodingName], 'binary')
};
