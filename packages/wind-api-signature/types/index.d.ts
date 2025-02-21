import { ApiSigner } from 'ApiSignatureAlgorithm';

/**
 * http media type
 */
declare enum HttpMediaType {
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
    APPLICATION_JSON_UTF8 = "application/json;charset=UTF-8"
}
interface ApiSignatureRequest {
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
declare const genNonce: () => string;
declare const matchMediaType: (contentType: HttpMediaType | string, expectMediaType: HttpMediaType | string) => boolean;

interface ApiSecretAccount {
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
interface ApiRequestSingerOptions {
    /**
     * 签名请求头前缀
     */
    headerPrefix?: string;
    /**
     * 开启调试模式
     */
    debug?: boolean;
}
declare class ApiRequestSinger {
    private readonly secretAccount;
    private readonly apiSigner;
    private readonly options;
    constructor(secretAccount: ApiSecretAccount, apiSigner: ApiSigner, options: ApiRequestSingerOptions);
    static hmacSha256: (secretAccount: ApiSecretAccount, options?: ApiRequestSingerOptions) => ApiRequestSinger;
    /**
     * 签名请求
     * @param request
     * @return 签名请求头对象
     */
    sign: (request: (Omit<ApiSignatureRequest, "nonce" | "timestamp"> & {
        nonce?: string;
        timestamp?: string;
    })) => Record<string, string>;
}

export { ApiRequestSinger, type ApiRequestSingerOptions, type ApiSecretAccount, type ApiSignatureRequest, HttpMediaType, genNonce, matchMediaType };
