import CryptoJS from 'crypto-js';
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

export interface SignatureRequest {

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

export interface SignatureOptions {

    /**
     * AK
     */
    accessKey: string;

    /**
     * SK
     */
    secretKey: string;

    /**
     * 签名请求头前缀
     */
    headerPrefix?: string;

    /**
     * 开启调试模式
     */
    debug?: boolean;
}


/**
 * 请求头
 * 32 为随机字符串
 */
const NONCE_HEADER_NAME = "Nonce";

/**
 * 请求头：时间戳
 * 用于验证签名有效期
 */
const TIMESTAMP_HEADER_NAME = "Timestamp";

/**
 * 请求头：AK
 * 用于交换 SK
 */
const ACCESS_KEY_HEADER_NAME = "Access-Key";

/**
 * 请求头
 * 签名字符串，用于验证请求是否合法
 */
const SIGN_HEADER_NAME = "Sign";

const fields = [
    "method",
    "requestPath",
    "nonce",
    "timestamp",
];


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


const getSignHeaderName = (name: string, headerPrefix?: string) => {
    if (headerPrefix) {
        return `${headerPrefix}-${name}`;
    }
    return name;
}

/**
 * 获取标准化查询字符串 ，key 按照字典序排序
 * @param queryParams
 */
export const getCanonicalizedQueryString = (queryParams?: Record<string, any>) => {
    if (queryParams) {
        return Object.keys(queryParams).sort().map((key) => {
            const val = queryParams[key];
            if (val === null || val == undefined) {
                return null;
            }
            if (Array.isArray(val)) {
                return val.map(value => `${key}=${value}`).join("&")
            }
            return `${key}=${val}`;
        }).filter(value => value != null).join("&");
    }
}

export const genSignatureText = (request: SignatureRequest) => {
    let signText = fields.map(field => {
        return `${field}=${request[field]}`
    }).join("&");
    const queryParams = request.queryParams;
    if (queryParams && Object.keys(queryParams).length > 0) {
        signText += `&queryStringMd5=${md5(getCanonicalizedQueryString(queryParams))}`;
    }
    if (request.requestBody) {
        signText += `&requestBodyMd5=${md5(request.requestBody)}`;
    }
    return signText;
}


/**
 * 请求签名
 * @param request
 * @param options
 * @return 请求签名请求头对象
 */
export const apiRequestSignature = (request: Omit<SignatureRequest, "nonce" | "timestamp">, options: SignatureOptions): Record<string, string> => {
    const signRequest: SignatureRequest = {
        ...request,
        method: request.method.toUpperCase() as any,
        nonce: genNonce(),
        timestamp: new Date().getTime().toString(),
    }
    const signatureText = genSignatureText(signRequest);
    const sha256 = CryptoJS.HmacSHA256(signatureText, options.secretKey);
    const headerPrefix = options.headerPrefix;
    const result = {
        [getSignHeaderName(SIGN_HEADER_NAME, headerPrefix)]: CryptoJS.enc.Base64.stringify(sha256),
        [getSignHeaderName(NONCE_HEADER_NAME, headerPrefix)]: signRequest.nonce,
        [getSignHeaderName(TIMESTAMP_HEADER_NAME, headerPrefix)]: signRequest.timestamp,
        [getSignHeaderName(ACCESS_KEY_HEADER_NAME, headerPrefix)]: options.accessKey
    };

    if (options.debug) {
        // debug 模式支持
        result['DebugObject'] = {
            request: signRequest,
            signatureText,
            queryString: getCanonicalizedQueryString(request.queryParams)
        }
    }
    return result;
}