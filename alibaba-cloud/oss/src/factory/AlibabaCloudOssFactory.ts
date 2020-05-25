import AliOssClient, {OssClientOptions} from "ali-oss";
import {AlibabaCloudOssConfiguration} from "./AlibabaCloudOssConfiguration";


//阿里云oss 可选的配置
export type OssClientOptionalOptions = Pick<OssClientOptions, Exclude<keyof OssClientOptions, keyof { accessKeyId: string; accessKeySecret: string; }>>


export interface AlibabaCloudOssFactory {

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
export  type AlibabaCloudOssConfigurationLoader = () => Promise<AlibabaCloudOssConfiguration>;

