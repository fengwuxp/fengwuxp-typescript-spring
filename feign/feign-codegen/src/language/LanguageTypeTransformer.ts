import {TypeDefinition} from "../model/TypeDefinition";
import {OpenApiVersion} from "../enums/OpenApiVersion";


export type ExtraProps = {
    feignClientName: string;
    tag: any;
} & Record<string, any>

/**
 * 语言类型定义转换器
 * 用于将OpenAPI文档描述转换为具体语言类型的的描述对象
 * {@link TypeDefinition}
 * @author wxup
 */
export interface LanguageTypeTransformer<T> {

    /**
     * 转换api描述对象
     * @param apiDesc api 描述对象
     * @param extraProps 额外的属性
     * @return 类型定义
     */
    transform: (apiDesc: T, extraProps: ExtraProps) => TypeDefinition;

    /**
     * 获取open api version
     */
    getOpenApiVersion: () => OpenApiVersion;
}