import {OpenApiConfigurer, OpenApiParser} from "../OpenApi";
import {TypeDefinition} from "../model/TypeDefinition";
import {registerSwaggerTypeTransformer} from "./SwaggerTypeTransformer";
import {Language} from "../enums/Language";
import TypescriptSwagger3TypeTransformer from "./v3/language/TypescriptSwagger3TypeTransformer";


export interface SwaggerOpenApiParser<T extends TypeDefinition = TypeDefinition> extends OpenApiParser<T[]> {

}

/**
 * 用于初始化swagger 相关的配置
 */
export const swaggerConfigurer:OpenApiConfigurer = () => {
    // 注册语言转换转者
    registerSwaggerTypeTransformer(Language.TYPESCRIPT, new TypescriptSwagger3TypeTransformer());
}
