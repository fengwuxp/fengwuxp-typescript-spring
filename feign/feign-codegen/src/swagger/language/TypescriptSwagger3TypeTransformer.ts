import {ApiMethodItem, SwaggerTypeTransformer} from "../SwaggerTypeTransformer";
import {TypeDefinition} from "../../model/TypeDefinition";
import {OpenApiVersion} from "../../enums/OpenApiVersion";
import {createTypeDefinition} from "../../util/TypeDefinitionUtils";

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
        const {feignClientName} = extraProps;
        return createTypeDefinition(feignClientName);
    }

    getOpenApiVersion = (): OpenApiVersion => {
        return OpenApiVersion.V3;
    }

}