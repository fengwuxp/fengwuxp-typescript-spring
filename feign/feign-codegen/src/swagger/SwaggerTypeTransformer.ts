import {LanguageTypeTransformer} from "../language/LanguageTypeTransformer";
import {HttpMethod} from "fengwuxp-typescript-feign";
import {OpenAPIV2, OpenAPIV3} from "openapi-types";
import {Language} from "../enums/Language";
import {OpenApiVersion} from "../enums/OpenApiVersion";

/**
 * api方法描述对象
 */
export interface ApiMethodItem {
    /**
     * 请求路径
     */
    uri: string;

    /**
     * 请求操作
     */
    operations: Record<HttpMethod, OpenAPIV2.OperationObject | OpenAPIV3.OperationObject>;

    /**
     * 支持的请求方法列表
     */
    httpMethods: HttpMethod[];

    /**
     * 归属的tags
     */
    tags: string[];
}

/**
 * 基于swagger文档的语言转换者，用于将文档描述转换为对应语言的类型描述，最终输出用于模板生成的对象
 * {@link TypeDefinition }
 */
export interface SwaggerTypeTransformer extends LanguageTypeTransformer<ApiMethodItem[]> {

}

type SwaggerTypeTransformerRecord = Record<OpenApiVersion, SwaggerTypeTransformer>;

const TYPE_TRANSFORMER_CACHE: Map<Language, SwaggerTypeTransformerRecord> = new Map<Language, SwaggerTypeTransformerRecord>();

export const registerSwaggerTypeTransformer = (language: Language, transformer: SwaggerTypeTransformer) => {
    let transformerRecords = TYPE_TRANSFORMER_CACHE.get(language);
    if (transformerRecords == null) {
        transformerRecords = {} as SwaggerTypeTransformerRecord;
        TYPE_TRANSFORMER_CACHE.set(language, transformerRecords);
    }
    transformerRecords[transformer.getOpenApiVersion()] = transformer;
}

export const getSwaggerTypeTransformer = (language: Language, version: OpenApiVersion = OpenApiVersion.V3): SwaggerTypeTransformer => {
    return (TYPE_TRANSFORMER_CACHE.get(language) || {})[version];
}