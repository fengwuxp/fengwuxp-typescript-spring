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
interface SignatureRequest {
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
interface SignatureOptions {
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
declare const matchMediaType: (contentType: HttpMediaType | string, expectMediaType: HttpMediaType | string) => boolean;
/**
 *  生成随机字符串
 */
declare const genNonce: () => string;
/**
 * 获取标准化查询字符串 ，key 按照字典序排序
 * @param queryParams
 */
declare const getCanonicalizedQueryString: (queryParams?: Record<string, any>) => string;
declare const genSignatureText: (request: SignatureRequest) => string;
/**
 * 请求签名
 * @param request
 * @param options
 * @return 请求签名请求头对象
 */
declare const apiRequestSignature: (request: Omit<SignatureRequest, "nonce" | "timestamp">, options: SignatureOptions) => Record<string, string>;

export { HttpMediaType, apiRequestSignature, genNonce, genSignatureText, getCanonicalizedQueryString, matchMediaType };
