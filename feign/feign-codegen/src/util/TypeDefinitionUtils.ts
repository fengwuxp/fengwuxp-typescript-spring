import {TypeDefinition} from "../model/TypeDefinition";
import {ClassDefinitionType} from "../enums/ClassDefinitionType";
import {newProxyInstance, ProxyScope} from "fengwuxp-common-proxy";

/**
 * 创建基础的数据类型
 * @param name
 * @param options
 */
export const createTypeDefinition = (name: string, options: Partial<TypeDefinition> = {}): TypeDefinition => {
    const definition = {
        type: ClassDefinitionType.CLASS,
        name,
        fullname: name,
        genericName: name,
        ...options
    };
    const proxyInstance = newProxyInstance<TypeDefinition>(definition, (object: TypeDefinition, property: PropertyKey, receiver: any) => {
        const element = object[property];
        if (property === "fullname") {
            const moduleName: string = object.package || "";
            return `${moduleName}${object.name}`
        }
        if (property === "genericName") {
            const {genericName, typeVariables, name} = object;
            if (genericName == null) {
                return name;
            }
            return genericName;
        }
        return element;
    }, (object, property, value, receiver) => {
        object[property] = value;
        return true;
    }, ProxyScope.PROPERTY);
    return proxyInstance;
}