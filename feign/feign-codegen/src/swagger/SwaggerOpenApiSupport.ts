import {OpenApiParser} from "../OpenApi";
import {TypeDefinition} from "../model/TypeDefinition";
import {registerSwaggerTypeTransformer} from "./SwaggerTypeTransformer";
import {Language} from "../enums/Language";
import TypescriptSwagger3TypeTransformer from "./language/TypescriptSwagger3TypeTransformer";


export interface SwaggerOpenApiParser<T extends TypeDefinition = TypeDefinition> extends OpenApiParser<T[]> {

}


registerSwaggerTypeTransformer(Language.TYPESCRIPT, new TypescriptSwagger3TypeTransformer());