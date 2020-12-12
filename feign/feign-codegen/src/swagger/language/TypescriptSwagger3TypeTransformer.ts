import {ApiMethodItem, SwaggerTypeTransformer} from "../SwaggerTypeTransformer";
import {MethodDefinition, TypeDefinition} from "../../model/TypeDefinition";
import {OpenApiVersion} from "../../enums/OpenApiVersion";
import {createTypeDefinition} from "../../util/TypeDefinitionUtils";
import {OpenAPIV3} from "openapi-types";
import {VOID} from "../../language/TypescriptTypeDefinition";

/**
 * 将swagger3的文档转换为typescript的类型定义
 */
export default class TypescriptSwagger3TypeTransformer implements SwaggerTypeTransformer {

    /**
     * @param apiMethods 方法列表
     * @param extraProps
     * @return 最终用于生成FeignClient的类型定义
     */
    transform = (apiMethods: ApiMethodItem[], extraProps: Record<string, any>): TypeDefinition => {
        const {feignClientName, tag} = extraProps;
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


    private transformMethod = (apiMethod: ApiMethodItem): MethodDefinition => {
        const {httpMethods} = apiMethod;
        const httpMethod = httpMethods[0];
        const operation = apiMethod.operations[httpMethod];
        return {
            name: operation.operationId,
            desc: operation.description,
            returnType: this.getMethodResponseType(operation.responses),
            params: [
                {
                    name: "req",
                    parameterType: this.getMethodParameterType(operation as OpenAPIV3.OperationObject)
                }
            ].filter(item => item.parameterType != null)
        };
    }

    /**
     * 获取方法的参数类型
     * requestBody or parameters
     * @param operation
     */
    private getMethodParameterType = (operation: OpenAPIV3.OperationObject): TypeDefinition => {
        const requestBody = operation.requestBody;
        if (requestBody != null) {
            const schema = this.getContentSchemaObject(requestBody);
            return this.transformTypeForSchema(schema);
        }
        const parameters = operation.parameters;
        if (parameters != null) {
            return this.margeMethodParametersToParameterType(parameters);
        }
        return null;
    }

    /**
     * 将方法的多个参数合并为一个参数
     * @param parameters
     */
    private margeMethodParametersToParameterType = (parameters: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>): TypeDefinition => {
        return null;
    }

    /**
     * 获取方法的返回值
     * @param response
     */
    private getMethodResponseType = (response: OpenAPIV3.ResponsesObject): TypeDefinition => {
        const schema: OpenAPIV3.SchemaObject = this.getContentSchemaObject(response["200"]);
        if (schema == null) {
            return VOID;
        }
        return this.transformTypeForSchema(schema);
    }

    /**
     * 获取内容的schema
     * @param contentTypeObject
     */
    private getContentSchemaObject = (contentTypeObject): OpenAPIV3.SchemaObject => {
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
    private transformTypeForSchema = (schema: OpenAPIV3.SchemaObject): TypeDefinition => {
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

    private transformTypeForObjectSchema = () => {

    }
}