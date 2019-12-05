import {RequestMappingOptions} from "../annotations/mapping/Mapping";
import {SignatureOptions} from "../annotations/security/Signature";
import {DataObfuscationOptions} from "../annotations/security/DataObfuscation";
import {HttpRetryOptions} from "../client/HttpRetryOptions";
import {AutoFileUploadOptions} from "../annotations/upload/FileUpload";
import {ValidateSchemaOptions} from "../annotations/validator/VailidatorSchema";

/**
 * feign的代理相关配置
 */
export interface FeignClientMethodConfig {

    /**
     * 请求配置
     */
    requestMapping?: RequestMappingOptions;

    /**
     * 签名相关
     */
    signature?: SignatureOptions;


    /**
     * 重试相关配置
     */
    retryOptions?: HttpRetryOptions;

    /**
     * 缓存相关配置
     */
    cacheOptions?: any;

    /**
     * 自动上传的相关配置
     */
    fileUploadOptions?: AutoFileUploadOptions;

    /**
     * 数据混淆配置
     */
    dataObfuscationOptions?: DataObfuscationOptions;

    /**
     * 数据验证配置
     */
    validateSchemaOptions?: ValidateSchemaOptions<any>;
}
