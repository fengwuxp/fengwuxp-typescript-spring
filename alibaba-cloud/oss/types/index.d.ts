import AliOssClient, { OssClientOptions, MultipartOptions, MultipartUploadResp } from 'ali-oss';
import { AbstractRequestFileObjectEncoder, FileUploadProgressBar, AutoFileUploadOptions, FileUploadStrategy, FeignRequestOptions, FileUploadStrategyResult } from 'fengwuxp-typescript-feign';

/**
 * 授权模式
 */
declare enum AliCloudAuthorizationMode {
    /**
     * AK/SK授权
     */
    AK_SK = "AK_SK",
    /**
     * STS授权
     */
    STS = "STS"
}

interface AlibabaCloudOssConfiguration {
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
    };
}

declare type OssClientOptionalOptions = Pick<OssClientOptions, Exclude<keyof OssClientOptions, keyof {
    accessKeyId: string;
    accessKeySecret: string;
}>>;
interface AlibabaCloudOssFactory {
    /**
     * 阿里云 {@link AliOssClient} 的工厂
     */
    factory: (ossClientOptions?: OssClientOptionalOptions) => Promise<AliOssClient>;
    /**
     * 获取配置
     */
    configuration: Readonly<AlibabaCloudOssConfiguration>;
}
/**
 * 用于获取 {@link AlibabaCloudOssConfiguration}的方法
 */
declare type AlibabaCloudOssConfigurationLoader = () => Promise<AlibabaCloudOssConfiguration>;

/**
 * 基于阿里云oss 的文件上传
 */
declare class AlibabaCloudOssFileObjectEncoder extends AbstractRequestFileObjectEncoder {
    private enabledSupportBase64;
    constructor(alibabaCloudOssFactory: AlibabaCloudOssFactory, fileUploadProgressBar: FileUploadProgressBar, multipartOptions?: MultipartOptions, enabledSupportBase64?: boolean);
    attrIsNeedUpload: (name: string, value: any, options: AutoFileUploadOptions) => boolean;
}

/**
 * 阿里云oos 文件上传策略
 */
declare class AlibabaCloudOssFileUploadStrategy implements FileUploadStrategy<File | Blob | string> {
    protected alibabaCloudOssFactory: AlibabaCloudOssFactory;
    protected multipartOptions: MultipartOptions;
    private _fileUploadProgressBar;
    constructor(alibabaCloudOssFactory: AlibabaCloudOssFactory, fileUploadProgressBar: FileUploadProgressBar, multipartOptions?: MultipartOptions);
    get fileUploadProgressBar(): Readonly<FileUploadProgressBar>;
    upload: (file: File | Blob | string, index: number, request: FeignRequestOptions) => Promise<FileUploadStrategyResult>;
    /**
     * 生成上传的文件名称
     * @param file
     */
    protected genUploadOssKey: (file: File | Blob | string) => string;
    /**
     * 获取文件扩展名称
     * @param file
     */
    protected getExtname: (file: File | Blob | string) => string;
    /**
     * 解析上传结果
     * @param resp
     */
    protected resolveUploadResult: (resp: MultipartUploadResp) => string[];
}

/**
 * 遵循约定 oos factory
 */
declare class ContractAlibabaCloudOssFactory implements AlibabaCloudOssFactory {
    /**
     * 用于加载 oss配置的加载器
     */
    protected configurationLoader: AlibabaCloudOssConfigurationLoader;
    /**
     * 阿里云 oss 配置
     */
    private _configuration;
    /**
     * 配置过期的毫秒数
     */
    protected expirationTime: number;
    /**
     * Refresh tokens 3 minutes in advance by default
     */
    protected aheadOfTimes: number;
    constructor(configurationLoader: AlibabaCloudOssConfigurationLoader, aheadOfTimes?: number);
    factory: (ossClientOptions: OssClientOptionalOptions | undefined) => Promise<AliOssClient>;
    /**
     * 刷新sts token
     */
    private refreshStsToken;
    private isStsAuthorizationMode;
    private resetExpiration;
    get configuration(): Readonly<AlibabaCloudOssConfiguration>;
}

export { AliCloudAuthorizationMode, AlibabaCloudOssConfiguration, AlibabaCloudOssConfigurationLoader, AlibabaCloudOssFactory, AlibabaCloudOssFileObjectEncoder, AlibabaCloudOssFileUploadStrategy, ContractAlibabaCloudOssFactory };
