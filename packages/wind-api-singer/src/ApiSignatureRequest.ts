import md5 from 'md5';

/**
 * http media type
 */
export enum HttpMediaType {

    /**
     * 表单
     */
    FORM = "application/x-www-form-urlencoded",

    /**
     * json
     */
    APPLICATION_JSON = "application/json",

    /**
     * JSON_UTF_8
     */
    APPLICATION_JSON_UTF8 = "application/json;charset=UTF-8",

}


export interface ApiSignatureRequest {

    /**
     * http 请求方法
     */
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

    /**
     * http 请求 path，不包含查询参数和域名
     */
    requestPath: string;

    /**
     * 32 位字符串
     */
    nonce: string;

    /**
     * 时间戳
     */
    timestamp: string;

    /**
     * 查询参数
     */
    queryParams?: Record<string, any>;

    /**
     * 请求体，根据 content-type 序列化好的字符串
     */
    requestBody?: string;
}


/**
 *  生成随机字符串
 */
export const genNonce = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // @ts-ignore
        return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16);
        // @ts-ignore
    }).replaceAll('-', '');
};


/**
 * 获取标准化查询字符串 ，key 按照字典序排序
 * @param queryParams
 */
export const getCanonicalizedQueryString = (queryParams?: Record<string, any>) => {
    const isEffectParam = (param) => {
        if (param === null || param === undefined) {
            return false;
        }
        return typeof param === "string" ? param.trim().length > 0 : true;
    }
    const joiner = (key, val) => {
        return isEffectParam(val) ? `${key}=${val}` : null;
    }
    if (queryParams) {
        return Object.keys(queryParams).sort().map((key) => {
            const val = queryParams[key];
            if (Array.isArray(val)) {
                return val.filter(isEffectParam).map(value => joiner(key, value)).filter(isEffectParam).join("&")
            }
            return joiner(key, val);
        }).filter(isEffectParam).join("&");
    }
}

const fields = [
    "method",
    "requestPath",
    "nonce",
    "timestamp",
];

/**
 * 获取摘要签名字符串
 * @param request
 */
export const getSignTextForDigest = (request: ApiSignatureRequest) => {
    let result = fields.map(field => {
        return `${field}=${request[field]}`
    }).join("&");
    const queryParams = request.queryParams;
    if (queryParams && Object.keys(queryParams).length > 0) {
        result += `&queryStringMd5=${md5(getCanonicalizedQueryString(queryParams))}`;
    }
    if (request.requestBody) {
        result += `&requestBodyMd5=${md5(request.requestBody)}`;
    }
    return result;
}

/**
 * 获取 sha256 with rsa 签名字符串
 * @param request
 */
export const getSignTextForSha256WithRsa = (request: ApiSignatureRequest) => {
    return `${request.method} ${request.requestPath}\n` +
        `${request.timestamp}\n` +
        `${request.nonce}\n` +
        `${getCanonicalizedQueryString(request.queryParams) ?? ''}\n` +
        `${request.requestBody ?? ''}\n`;
}


export const matchMediaType = (contentType: HttpMediaType | string, expectMediaType: HttpMediaType | string) => {
    if (contentType == null || expectMediaType == null) {
        return false;
    }

    if (contentType === expectMediaType) {
        return true;
    }
    const [t1] = contentType.split(";");
    const [t2] = expectMediaType.split(";");
    return t1 == t2;
};
