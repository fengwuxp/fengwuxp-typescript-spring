import {HttpMediaType} from "../constant/http/HttpMediaType";


const UTF_8 = ";charset=UTF-8";

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
    return type1.replace(UTF_8, "") === type2.replace(UTF_8, "");
};
