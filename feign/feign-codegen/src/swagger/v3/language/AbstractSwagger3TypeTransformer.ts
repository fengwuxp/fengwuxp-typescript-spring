import {ApiMethodItem, SwaggerTypeTransformer} from "../../SwaggerTypeTransformer";
import {OpenApiVersion} from "../../../enums/OpenApiVersion";
import {MethodDefinition, TypeDefinition} from "../../../model/TypeDefinition";
import {createTypeDefinition} from "../../../util/TypeDefinitionUtils";
import {OpenAPIV3} from "openapi-types";
import {ExtraProps} from "../../../language/LanguageTypeTransformer";


/**
 * 抽象的 Swagger3文档类型转换，定义了将swagger3的文档转换为{@link TypeDefinition}的
 * 定义，不同的语言可能根据语言的特性实现具体的细节
 * {link #transformMethod}
 */
export abstract class AbstractSwagger3TypeTransformer implements SwaggerTypeTransformer {


    constructor() {
    }

    /**
     * 转换api描述对象
     * @param apiMethods 方法列表
     * @param extraProps
     * @return 最终用于生成FeignClient的类型定义
     */
    transform = (apiMethods: ApiMethodItem[], extraProps: ExtraProps): TypeDefinition => {
        const {feignClientName, tag}: { feignClientName: string, tag: OpenAPIV3.TagObject } = extraProps;
        const methods = apiMethods.map(this.transformMethod);
        return createTypeDefinition(feignClientName, {
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
            }).flatMap(items => [...items])
        });
    }

    getOpenApiVersion = (): OpenApiVersion => {
        return OpenApiVersion.V3;
    }

    /**
     * 将open api文档描述的方法对象，转换为方法定义
     * @protected
     */
    protected abstract transformMethod: (apiMethod: ApiMethodItem) => MethodDefinition;

    /**
     * 获取方法的参数类型
     * requestBody or parameters
     * @param operation
     */
    protected abstract getMethodParameterType: (operation: OpenAPIV3.OperationObject) => TypeDefinition;


    /**
     * 获取方法的返回值
     * @param response
     */
    protected getMethodResponseType(response: OpenAPIV3.ResponsesObject): TypeDefinition {
        const schema: OpenAPIV3.SchemaObject = this.getContentSchemaObject(response["200"]);
        if (schema == null) {
            return null;
        }
        return this.transformTypeForSchema(schema);
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
        return content[keys[0]]
    }


    /**
     * 通过schema对象生成类型定义
     * @param schema
     */
    protected transformTypeForSchema = (schema: OpenAPIV3.SchemaObject): TypeDefinition => {
        switch (schema.type) {
            case "object":
                break;
            case "array":
                break;
            case "boolean":
                break;
            case "integer":
                break;
            case "number":
                break;
            case "string":
                break;
        }
        return null;
    }


}




