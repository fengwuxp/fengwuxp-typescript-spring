import {ApiMethodItem} from "../../SwaggerTypeTransformer";
import {MethodDefinition, TypeDefinition} from "../../../model/TypeDefinition";
import {OpenAPIV3} from "openapi-types";
import {VOID, BOOLEAN, NUMBER, STRING, DATE} from "../../../language/TypescriptTypeDefinition";
import {AbstractSwagger3TypeTransformer, Swagger3ExtraProps} from "./AbstractSwagger3TypeTransformer";
import {OpenApiClassType} from "../../../enums/ClassDefinitionType";

/**
 * 将swagger3的文档转换为typescript的类型定义
 */
export default class TypescriptSwagger3TypeTransformer extends AbstractSwagger3TypeTransformer {


    protected transformMethod = (apiMethod: ApiMethodItem, extraProps: Swagger3ExtraProps): MethodDefinition => {
        const {httpMethods} = apiMethod;
        const {swaggerComponents} = extraProps;
        const httpMethod = httpMethods[0];
        const operation = apiMethod.operations[httpMethod];
        return {
            name: operation.operationId,
            desc: operation.description,
            returnType: this.getMethodResponseType(operation.responses, extraProps),
            params: [
                {
                    name: "req",
                    parameterType: this.getMethodParameterType(operation as OpenAPIV3.OperationObject, swaggerComponents)
                }
            ].filter(item => item.parameterType != null)
        };
    }

    /**
     * 获取方法的参数类型
     * requestBody or parameters
     * @param operation
     * @param components
     */
    protected getMethodParameterType = (operation: OpenAPIV3.OperationObject, components: OpenAPIV3.ComponentsObject): TypeDefinition => {
        const requestBody = operation.requestBody;
        if (requestBody != null) {
            const schema = this.getContentSchemaObject(requestBody);
            return this.transformTypeForSchema(schema, components,0);
        }
        const parameters = operation.parameters;
        if (parameters != null) {
            return this.margeMethodParametersToParameterType(parameters);
        }
        return null;
    }

    protected getBasicType = (type: OpenApiClassType): TypeDefinition => {
        switch (type) {
            case OpenApiClassType.BOOLEAN:
                return BOOLEAN;
            case OpenApiClassType.INTEGER:
            case OpenApiClassType.NUMBER:
                return NUMBER;
            case OpenApiClassType.STRING:
                return STRING;
            case OpenApiClassType.DATE:
                return DATE;
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
     * @param extraProps
     */
    protected getMethodResponseType(response: OpenAPIV3.ResponsesObject, extraProps: Swagger3ExtraProps): TypeDefinition {
        const responseType = super.getMethodResponseType(response, extraProps)
        if (responseType == null) {
            return VOID;
        }
        return responseType;
    }

}