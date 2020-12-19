import {ApiMethodItem, SwaggerTypeTransformer} from "../../SwaggerTypeTransformer";
import {OpenApiVersion} from "../../../enums/OpenApiVersion";
import {FiledDefinition, MethodDefinition, TypeDefinition} from "../../../model/TypeDefinition";
import {createTypeDefinition} from "../../../util/TypeDefinitionUtils";
import {OpenAPIV3} from "openapi-types";
import equal from "fast-deep-equal";
import {ClassDefinitionType, OpenApiClassType} from "../../../enums/ClassDefinitionType";
import {MatchUnifiedResponseObjectFunc} from "../../../OpenApiCodegenOptions";
import * as log4js from "log4js";

const logger = log4js.getLogger("DefaultOpenApiCodeGenerator");

export type Swagger3ExtraProps = {
    feignClientName: string;
    tag: OpenAPIV3.TagObject;
    swaggerComponents: OpenAPIV3.ComponentsObject;
    matchUnifiedResponseObject?: MatchUnifiedResponseObjectFunc;
    matchGenericObjects?: MatchUnifiedResponseObjectFunc[];
};

const MAX_TYPE_COUNT = 32;

const GEN_RESULT_CACHE = {};

const getTypeCache = (typeName: string) => {
    return GEN_RESULT_CACHE[typeName];
}

const putTypeCache = (typeName: string, type: TypeDefinition) => {
    GEN_RESULT_CACHE[typeName] = type;
}

/**
 * 抽象的 Swagger3文档类型转换，定义了将swagger3的文档转换为{@link TypeDefinition}的
 * 定义，不同的语言可能根据语言的特性实现具体的细节
 * {link #transformMethod}
 */
export abstract class AbstractSwagger3TypeTransformer implements SwaggerTypeTransformer {


    /**
     * 转换api描述对象
     * @param apiMethods 方法列表
     * @param extraProps
     * @return 最终用于生成FeignClient的类型定义
     */
    transform = (apiMethods: ApiMethodItem[], extraProps: Swagger3ExtraProps): TypeDefinition => {
        const {feignClientName, tag} = extraProps as Swagger3ExtraProps;
        const methods = apiMethods.map(item => this.transformMethod(item, extraProps));
        return {
            ...createTypeDefinition(feignClientName, {
                fullname: feignClientName,
                genericName: feignClientName,
                desc: tag.description != tag.name ? `${tag.name} ${tag.description}` : tag.description,
                methods,
                dependencies: methods.map((type) => {
                    return [
                        ...type.params.map((params) => {
                            return params.parameterType;
                        }),
                        type.returnType
                    ]
                }).flatMap(items => [...items]).filter(item => item.needCodegen || item.needImport),
                needCodegen: true
            })
        };
    }

    getOpenApiVersion = (): OpenApiVersion => {
        return OpenApiVersion.V3;
    }

    /**
     * 将open api文档描述的方法对象，转换为方法定义
     *
     * @param apiMethod
     * @param extraProps
     */
    protected abstract transformMethod: (apiMethod: ApiMethodItem, extraProps: Swagger3ExtraProps) => MethodDefinition;

    /**
     * 获取方法的参数类型
     * requestBody or parameters
     * @param operation
     * @param components
     */
    protected abstract getMethodParameterType: (operation: OpenAPIV3.OperationObject, components: OpenAPIV3.ComponentsObject) => TypeDefinition;

    /**
     * 获取一个t基础类型对象
     * @protected
     */
    protected abstract getBasicType: (type: OpenApiClassType) => TypeDefinition;


    /**
     * 获取方法的返回值
     * @param response
     * @param extraProps
     */
    protected getMethodResponseType(response: OpenAPIV3.ResponsesObject, extraProps: Swagger3ExtraProps): TypeDefinition {
        const schema: OpenAPIV3.SchemaObject = this.getContentSchemaObject(response["200"]);
        if (schema == null) {
            return null;
        }
        const {swaggerComponents, matchUnifiedResponseObject} = extraProps;
        if (schema.type != 'object') {
            return this.transformTypeForSchema(schema, swaggerComponents, 0);
        }

        // 处理统一响应或泛型对象
        const properties = schema.properties;
        if (properties == null) {
            return null;
        }
        const result = matchUnifiedResponseObject(Object.keys(properties).map(key => {
            return {
                name: key,
                type: properties[key]['type']
            }
        }));
        if (result == null) {
            return this.transformTypeForSchema(schema, swaggerComponents, 0);
        }
        if (result.unifiedResponse) {
            const typeObject = properties[result.dataKey];
            if (typeObject == null) {
                return null;
            }
            return this.getMethodResponseType({
                "200": {
                    content: {
                        "*/*": {
                            schema: typeObject
                        }
                    }
                }
            } as any, extraProps)
        } else {
            const property = properties[result.dataKey];
            const typeVariable = this.transformTypeForSchema(property as any, swaggerComponents, 0);
            const returnType = this.transformTypeForSchema(schema, swaggerComponents, 0);
            returnType.name = result.genericName;
            returnType.fullname = result.genericName;
            returnType.genericName = result.genericName;
            returnType.genericDescription = result.genericDescription;
            returnType.typeVariables = [typeVariable];
            return returnType;
        }
    }

    /**
     * 获取内容的schema
     * {@link OpenAPIV3.OperationObject.requestBody}
     * {@link OpenAPIV3.ResponsesObject}
     * @param contentTypeObject api method方法响应对象或方法的请求对象的描述
     */
    protected getContentSchemaObject = (contentTypeObject): OpenAPIV3.SchemaObject => {
        const content = contentTypeObject['content'];
        if (content == null) {
            return null;
        }
        const keys = Object.keys(content);
        return content[keys[0]].schema;
    }


    /**
     * 通过schema对象生成类型定义
     * @param schema
     * @param components
     * @param count 对于同一个对象的生成次数
     */
    protected transformTypeForSchema = (schema: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject, count: number): TypeDefinition => {
        count++;
        switch (schema.type) {
            case "object":
                return this.transformObject(schema, components, count);
            case "array":
                return this.transformTypeForSchema(schema.items as any, components, count);
            case "boolean":
                return this.getBasicLanguageType(OpenApiClassType.BOOLEAN);
            case "integer":
                return this.getBasicLanguageType(OpenApiClassType.INTEGER);
            case "number":
                return this.getBasicLanguageType(OpenApiClassType.NUMBER);
            case "string":
                if (schema.enum != null) {
                    const name = this.findSchemaName(schema, components);
                    return createTypeDefinition(name, {
                        fields: schema.enum.map(item => {
                            return {
                                name: item,
                                filedType: this.getBasicLanguageType(OpenApiClassType.STRING)
                            }
                        })
                    })
                }
                return this.getBasicLanguageType(OpenApiClassType.STRING);
        }
        return null;
    }

    private transformObject = (schema: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject, count: number): TypeDefinition => {

        if (schema == null || count > MAX_TYPE_COUNT) {
            return null;
        }

        const {properties, required} = schema;
        const name = this.findSchemaName(schema, components);

        const typeCache = getTypeCache(name);
        if (typeCache != null) {
            return typeCache;
        }
        if (properties == null) {
            return null;
        }
        const fields: FiledDefinition[] = Object.keys(properties).map(key => {
            const property = properties[key] as OpenAPIV3.SchemaObject;
            return {
                name: key,
                desc: property.description,
                filedType: this.transformTypeForSchema(property, components, count),
                required: required == null ? false : required.some(name => name === key),
            };
        });

        const typeResult: TypeDefinition = {
            name,
            fullname: name,
            genericName: name,
            fields,
            type: ClassDefinitionType.CLASS,
            needCodegen: true,
            needImport: true,
            dependencies: fields.map(item => item.filedType)
        };
        putTypeCache(name, typeResult);
        return typeResult;
    }

    /**
     * 获取一个语言的基础类型对象
     * @protected
     */
    private getBasicLanguageType = (type: OpenApiClassType) => {
        const basicType = this.getBasicType(type);
        if (basicType == null) {
            return undefined
        }
        return {
            ...basicType
        }
    };

    private findSchemaName = (schema: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject): string => {
        const {schemas} = components;
        return Object.keys(schemas).find(key => {
            return equal(schemas[key], schema)
        })
    }

}




