import {
    AlibabaCloudOssFactory,
    AlibabaCloudOssConfigurationLoader,
    OssClientOptionalOptions
} from "./AlibabaCloudOssFactory";
import AliOssClient, {OssClientOptions} from "ali-oss";
import {AlibabaCloudOssConfiguration} from "./AlibabaCloudOssConfiguration";
import {AliCloudAuthorizationMode} from "../AliCloudAuthorizationMode";

/**
 * 遵循约定 oos factory
 */
export default class ContractAlibabaCloudOssFactory implements AlibabaCloudOssFactory {


    /**
     * 用于加载 oss配置的加载器
     */
    protected configurationLoader: AlibabaCloudOssConfigurationLoader;

    /**
     * 阿里云 oss 配置
     */
    private _configuration: AlibabaCloudOssConfiguration;

    /**
     * 配置过期的毫秒数
     */
    protected expirationTime: number = -1;

    /**
     * Refresh tokens 3 minutes in advance by default
     */
    protected aheadOfTimes: number;


    constructor(configurationLoader: AlibabaCloudOssConfigurationLoader, aheadOfTimes?: number) {
        this.configurationLoader = configurationLoader;
        this.aheadOfTimes = aheadOfTimes || 3 * 60 * 1000;
    }

    factory = async (ossClientOptions: OssClientOptionalOptions | undefined): Promise<AliOssClient> => {

        const cloudOssConfiguration = this._configuration;
        //提前3分钟刷新token
        const needRefreshToken = cloudOssConfiguration == null || new Date().getTime() + this.aheadOfTimes > this.expirationTime;
        if (needRefreshToken) {
            // 刷新token
            await this.refreshStsToken();
        }

        const options: OssClientOptions = {
            useFetch: true,
            stsToken: cloudOssConfiguration.sts == null ? null : cloudOssConfiguration.sts.securityToken,
            accessKeyId: cloudOssConfiguration.accessKeyId,
            accessKeySecret: cloudOssConfiguration.accessKeySecret,
            endpoint: cloudOssConfiguration.endpoint,
            bucket: cloudOssConfiguration.bucketName,
            timeout: 60 * 1000,
            ...ossClientOptions,
        };
        return new AliOssClient(options, {});

    }


    /**
     * 刷新sts token
     */
    private refreshStsToken = async () => {
        const cloudOssConfiguration = await this.configurationLoader();
        if (this.isStsAuthorizationMode(cloudOssConfiguration)) {
            this.resetExpiration(cloudOssConfiguration);
        }

        this._configuration = cloudOssConfiguration;
    }

    private isStsAuthorizationMode(cloudOssConfiguration: AlibabaCloudOssConfiguration) {
        return cloudOssConfiguration.authorizationMode === AliCloudAuthorizationMode.STS;
    }

    private resetExpiration = (configuration: AlibabaCloudOssConfiguration) => {
        this.expirationTime = new Date().getTime() + configuration.sts.expirationSeconds * 1000;
    }


    get configuration(): Readonly<AlibabaCloudOssConfiguration> {
        return this._configuration;
    }

}
