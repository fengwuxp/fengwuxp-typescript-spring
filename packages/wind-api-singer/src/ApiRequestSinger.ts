import CryptoJS from 'crypto-js';
import md5 from 'md5';

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
    queryParams?: Record<string, string[]>;

    /**
     * 请求体
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
    headerPrefix?: string
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

export const getCanonicalizedQueryString = (queryParams?: Record<string, string[]>) => {
    return Object.keys(queryParams).sort().map((item) => {
        const key = item.toString();
        let params = queryParams[key];
        if (params == null || params.length === 0) {
            return;
        }
        return params.map(value => `${key}=${value}`).join("&")
    }).join("&");
}

const genUUID = (): string => {
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
export const requestApiSign = (request: Omit<SignatureRequest, "nonce" | "timestamp">, options: SignatureOptions): Record<string, string> => {
    const signRequest: SignatureRequest = {
        ...request,
        nonce: genUUID(),
        timestamp: new Date().getTime().toString(),
    }
    const hash = CryptoJS.HmacSHA256(genSignatureText(signRequest), options.secretKey);
    const headerPrefix = options.headerPrefix;
    return {
        [getSignHeaderName(SIGN_HEADER_NAME, headerPrefix)]: CryptoJS.enc.Base64.stringify(hash),
        [getSignHeaderName(NONCE_HEADER_NAME, headerPrefix)]: signRequest.nonce,
        [getSignHeaderName(TIMESTAMP_HEADER_NAME, headerPrefix)]: signRequest.timestamp,
        [getSignHeaderName(ACCESS_KEY_HEADER_NAME, headerPrefix)]: options.accessKey,
    };
}