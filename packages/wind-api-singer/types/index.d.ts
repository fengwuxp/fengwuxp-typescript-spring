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
    queryParams?: Record<string, string[]>;
    /**
     * 请求体
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
}
/**
 * 请求签名
 * @param request
 * @param options
 * @return 请求签名请求头对象
 */
declare const requestApiSign: (request: Omit<SignatureRequest, "nonce" | "timestamp">, options: SignatureOptions) => Record<string, string>;

export { requestApiSign };
