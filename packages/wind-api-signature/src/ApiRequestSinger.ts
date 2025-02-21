import {ApiSigner, HMAC_SHA256} from 'ApiSignatureAlgorithm';
import {ApiSignatureRequest, genNonce, getCanonicalizedQueryString, getSignTextForDigest, getSignTextForSha256WithRsa} from "./ApiSignatureRequest";


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
 * 请求头：访问标识
 * 用于交换签名秘钥
 */
const ACCESS_KEY_HEADER_NAME = "Access-Id";

/**
 * 请求头：秘钥版本号
 * 用于标记使用的秘钥对版本
 * 非 AK/SK 访问模式需要
 */
const SECRET_VERSION_HEADER_NAME = "Secret-Version";

/**
 * 请求头
 * 签名字符串，用于验证请求是否合法
 */
const SIGN_HEADER_NAME = "Sign";


export interface ApiSecretAccount {

    /**
     * AccessKey or AppId
     * 账号访问唯一标识
     */
    accessId: string;

    /**
     * 签名秘钥
     */
    secretKey: string;

    /**
     * 秘钥版本
     */
    secretVersion?: string;
}

export interface ApiRequestSingerOptions {

    /**
     * 签名请求头前缀
     */
    headerPrefix?: string;

    /**
     * 开启调试模式
     */
    debug?: boolean;
}

const getSignHeaderName = (name: string, headerPrefix?: string) => {
    if (headerPrefix) {
        return `${headerPrefix}-${name}`;
    }
    return name;
}


export class ApiRequestSinger {

    private readonly secretAccount: ApiSecretAccount;

    private readonly apiSigner: ApiSigner;

    private readonly options: ApiRequestSingerOptions;

    constructor(secretAccount: ApiSecretAccount, apiSigner: ApiSigner, options: ApiRequestSingerOptions) {
        this.secretAccount = secretAccount;
        this.apiSigner = apiSigner;
        this.options = options;
    }

    static hmacSha256 = (secretAccount: ApiSecretAccount, options: ApiRequestSingerOptions = {headerPrefix: "Wind"}): ApiRequestSinger => {
        return new ApiRequestSinger(secretAccount, HMAC_SHA256, options);
    }

    /**
     * 签名请求
     * @param request
     * @return 签名请求头对象
     */
    sign = (request: (Omit<ApiSignatureRequest, "nonce" | "timestamp"> & { nonce?: string; timestamp?: string; })): Record<string, string> => {
        const {secretAccount, apiSigner, options} = this;
        const signRequest: ApiSignatureRequest = {
            timestamp: new Date().getTime().toString(),
            nonce: genNonce(),
            ...request,
            method: request.method.toUpperCase() as any
        }
        const headerPrefix = options.headerPrefix;
        const result = {
            [getSignHeaderName(SIGN_HEADER_NAME, headerPrefix)]: apiSigner.sign(signRequest, secretAccount.secretKey),
            [getSignHeaderName(NONCE_HEADER_NAME, headerPrefix)]: signRequest.nonce,
            [getSignHeaderName(TIMESTAMP_HEADER_NAME, headerPrefix)]: signRequest.timestamp,
            [getSignHeaderName(ACCESS_KEY_HEADER_NAME, headerPrefix)]: secretAccount.accessId,
            [getSignHeaderName(SECRET_VERSION_HEADER_NAME, headerPrefix)]: secretAccount.secretVersion
        };

        if (options.debug) {
            // debug 模式支持
            // @ts-ignore
            result['DebugHeaders'] = {
                request: signRequest,
                // TODO 待优化
                signatureText: apiSigner === HMAC_SHA256 ? getSignTextForDigest(signRequest) : getSignTextForSha256WithRsa(signRequest),
                queryString: getCanonicalizedQueryString(request.queryParams)
            }
        }
        return result;
    }
}
