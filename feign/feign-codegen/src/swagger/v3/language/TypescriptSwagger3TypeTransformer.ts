import {ApiMethodItem} from "../../SwaggerTypeTransformer";
import {MethodDefinition, TypeDefinition} from "../../../model/TypeDefinition";
import {OpenAPIV3} from "openapi-types";
import {VOID} from "../../../language/TypescriptTypeDefinition";
import {AbstractSwagger3TypeTransformer} from "./AbstractSwagger3TypeTransformer";

/**
 * 将swagger3的文档转换为typescript的类型定义
 */
export default class TypescriptSwagger3TypeTransformer extends AbstractSwagger3TypeTransformer {

    constructor() {
        super();
    }

    protected transformMethod = (apiMethod: ApiMethodItem): MethodDefinition => {
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
    protected getMethodParameterType = (operation: OpenAPIV3.OperationObject): TypeDefinition => {
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
    protected getMethodResponseType  (response: OpenAPIV3.ResponsesObject): TypeDefinition  {
        const responseType = super.getMethodResponseType(response)
        if (responseType == null) {
            return VOID;
        }
        return responseType;
    }

}