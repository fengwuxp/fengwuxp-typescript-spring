import {ApiSignatureRequest, getSignTextForDigest, getSignTextForSha256WithRsa} from "./ApiSignatureRequest";
import jsrsasign from "jsrsasign";


export interface ApiSigner {

    /**
     * 生成签名
     *
     * @param request   签名请求
     * @param secretKey 签名秘钥
     * @return 签名结果
     */
    sign: (request: ApiSignatureRequest, secretKey: string) => string;

    /**
     * 签名验证
     *
     * @param request   用于验证签名的请求
     * @param secretKey 签名秘钥
     * @param sign      待验证的签名
     * @return 签名验证是否通过
     */
    verify: (request: ApiSignatureRequest, secretKey: string, sign: string) => boolean;
}

/**
 * 摘要签名
 * 参见：https://www.yuque.com/suiyuerufeng-akjad/wind/qal4b72cxw84cu6g
 */
const HMAC_SHA256: ApiSigner = {
    sign: (request, secretKey) => {
        const hmacsha256 = new jsrsasign.KJUR.crypto.Mac({
            alg: "HmacSHA256",
            pass: secretKey
        });
        hmacsha256.updateString(getSignTextForDigest(request));
        return jsrsasign.hextob64(hmacsha256.doFinal());
    },
    verify: (request, secretKey, sign) => {
        return HMAC_SHA256.sign(request, secretKey) === sign;
    }
};

const SHA256_WITH_RSA_ALGORITHM = "SHA256withRSA"

/**
 * 参见：https://www.yuque.com/suiyuerufeng-akjad/wind/qal4b72cxw84cu6g
 */
const SHA256_WITH_RSA: ApiSigner = {
    sign: (request, privateKey) => {
        const key = jsrsasign.KEYUTIL.getKey(`-----BEGIN PRIVATE KEY-----${privateKey}-----END PRIVATE KEY-----`);
        const signature = new jsrsasign.KJUR.crypto.Signature({
            alg: SHA256_WITH_RSA_ALGORITHM
        });
        signature.init(key);
        signature.updateString(getSignTextForSha256WithRsa(request));
        // 签名后的为 16 进制字符串，这里转换为 Base64 进制字符串
        return jsrsasign.hextob64(signature.sign());
    },
    verify: (request, publikcKey, sign) => {
        const key = jsrsasign.KEYUTIL.getKey(`-----BEGIN PUBLIC KEY-----${publikcKey}-----END PUBLIC KEY-----`, "passcode");
        const signature = new jsrsasign.KJUR.crypto.Signature({
            alg: SHA256_WITH_RSA_ALGORITHM,
        });
        signature.init(key);
        signature.updateString(getSignTextForSha256WithRsa(request));
        // 需要将 Base64 进制签名字符串转换成 16 进制字符串
        return signature.verify(jsrsasign.b64tohex(sign));
    }
};


export {
    HMAC_SHA256,
    SHA256_WITH_RSA
}
