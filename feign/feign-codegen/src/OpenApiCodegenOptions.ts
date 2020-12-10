import {Language} from './enums/Language';

/**
 * 代码生成的配置
 */
export interface OpenApiCodegenOptions {

    /**
     * 输出的配置
     */
    output: OutputOptions;

    /**
     * 用于转换将标签装换为FeignClient的名称
     * @param tageName
     * @param tageDesc
     * @param uri 请求路径
     */
    getFeignClientName: (tageName: string, tageDesc: string, uri: string) => string;
}


export interface OutputOptions {

    /**
     * 输出的目录
     */
    output: string;

    /**
     * 计算额外的输出目录，枚举类型将不会参与该计算
     * @param prefixUri 路径前缀
     * @param isClient  是否为client的类
     * @return 如果返回<code>null<code>，则不作处理
     */
    computeExtraOutDir: (prefixUri: string, isClient: boolean) => string;

    /**
     * feign client名称后缀，默认FeignClient
     */
    clientNameSuffix: string;

    /**
     * 输出的sdk的语言
     */
    language: Language;

    /**
     * client的实现提供者
     * 例如：openfeign\retrofit等
     */
    clientProvider: string;

    /**
     * 额外信息
     * @key runPlatform 运行平台，例如: android\weex\rn 等
     */
    extraProps?: Partial<{ "runPlatform": string }> & Record<string, any>;

}


export interface CodegenOptions {


}