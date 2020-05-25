/**
 * 阿里云 oss 配置
 */
import {AliCloudAuthorizationMode} from "../AliCloudAuthorizationMode";

export interface AlibabaCloudOssConfiguration {


    /**
     * 授权接入ID
     * 如果 authorizationMode 为 {@code AliCloudAuthorizationMode.STS}
     * 这个 accessKeyId就是 sts accessKeyId
     */
    accessKeyId: string;

    /**
     * 授权接入密钥
     * 如果 authorizationMode 为 {@code AliCloudAuthorizationMode.STS}
     * 这个 accessKeySecret 就是 sts accessKeySecret
     */
    accessKeySecret: string;


    /**
     * 授权模式
     */
    authorizationMode: AliCloudAuthorizationMode;

    /**
     * Endpoint, please see <a href=
     * "https://help.aliyun.com/document_detail/32010.html?spm=a2c4g.11186623.6.659.29f145dc3KOwTh">oss
     * docs</a>.
     */
    endpoint: string;


    /**
     * 阿里云OSS BucketName
     */
    bucketName: string;

    /**
     * 阿里云OSS上传根路径
     */
    basePath: string;

    /**
     * Sts token, please see <a href=
     * "https://help.aliyun.com/document_detail/32010.html?spm=a2c4g.11186623.6.659.29f145dc3KOwTh">oss
     * docs</a>.
     */
    sts: {

        /**
         * 访问token
         */
        securityToken: string;

        /**
         * 访问token有效秒数
         */
        expirationSeconds: number;
    }
}
