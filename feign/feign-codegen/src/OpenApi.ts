import {OpenApiCodegenOptionsAware} from "./OpenApiCodegenOptionsAware";

/**
 * 提供对open api 标准文档的解析
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md
 */
export interface OpenApiParser<T = any> extends OpenApiCodegenOptionsAware {

    parse: () => Promise<T>;
}

/**
 * 提供open api 标准文档的代码生成
 */
export interface OpenApiCodeGenerator {

    generate: () => Promise<void>;
}

/**
 * 用于初始化对应open api 相关的配置
 */
export type OpenApiConfigurer = () => void;