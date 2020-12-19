import {Language} from './enums/Language';
import equal from "fast-deep-equal";

export type MatchUnifiedResponseObjectFunc = (fields: Array<{ name: string; type?: string }>) => GenericObjectFieldsType | null | undefined;

type GenericObjectFieldsType = {

    fields: string[];

    // 统一响应，默认：false
    unifiedResponse?: boolean,

    // 默认data
    dataKey?: string;

    /**
     * 带泛型的名称，默认为name
     * {@link TypeDefinition#name}
     */
    genericName?: string;

    /***
     * 泛型描述
     */
    genericDescription?: string;
};

/**
 * 代码生成的配置
 */
export interface OpenApiCodegenOptions {

    /**
     * api 接口文档内容地址
     */
    apiUrl: string;

    /**
     * 认证信息
     */
    authentication?: any;

    /**
     * 输出的配置，可以输出多种语言的sdk
     */
    output: OutputOptions | Array<OutputOptions>;

    /**
     * 用于转换将标签装换为FeignClient的名称
     * @param tageName
     * @param tageDesc
     * @param uri 请求路径
     */
    getFeignClientName: (tageName: string, tageDesc: string, uri: string) => string;

    // /**
    //  * 用于标记识别统一响应对象
    //  * @param fields
    //  * @see #unifiedResponseObjectFields
    //  * @return data key
    //  */
    // matchUnifiedResponseObject?: MatchUnifiedResponseObjectFunc;
    //
    // /**
    //  * 统一响应对象的字段列表，用于识别统一响应对象
    //  * @see #matchUnifiedResponseObject
    //  */
    // unifiedResponseObjectFields?: GenericObjectFieldsType;

    /**
     * 用于标记识别其他的泛型响应对象
     * @param fields
     * @see #genericObjectFields
     * @return data key
     */
    matchGenericObjects?: MatchUnifiedResponseObjectFunc[];

    /**
     * 泛型响应对象的字段列表，用于识别泛型响应对象
     * @see #matchUnifiedResponseObject
     */
    genericObjectFields?: GenericObjectFieldsType[];
}

export const nameMatchUnifiedResponseObject = (typeFields: Array<{ name: string; type?: string }>, markObject: GenericObjectFieldsType): string | GenericObjectFieldsType => {
    const names = typeFields.map(item => item.name);
    const {fields, dataKey} = markObject;
    if (fields.length === names.length && equal(names.sort(), fields.sort())) {
        return {
            ...markObject,
            dataKey: dataKey || "data"
        }
    }
    return undefined;
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

export type OpenApiParseOptions = Exclude<OpenApiCodegenOptions, "output"> & {

    output: OutputOptions
};

export interface OpenApiParseOptionsAware {

    setOpenApiParseOptions: (options: OpenApiParseOptions) => void;
}




