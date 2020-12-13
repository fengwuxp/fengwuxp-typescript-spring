import {TypeDefinition} from "../model/TypeDefinition";
import {ClassDefinitionType} from "../enums/ClassDefinitionType";
import {newProxyInstance, ProxyScope} from "fengwuxp-common-proxy";

/**
 * 创建语言的基础类型定义，不需要生成也不需要导入的类型定义
 * @param name
 * @param options
 */
export const createLanguageTypeDefinition = (name: string, options: Partial<Omit<TypeDefinition, "needCodegen" | "needImport">> = {}): TypeDefinition => {

    return createTypeDefinition(name, {
        ...options,
        needImport: false,
        needCodegen: false
    })
}

/**
 * 创建数据类型,返回一个代理对象
 * @param name
 * @param options
 */
export const createTypeDefinition = (name: string, options: Partial<TypeDefinition> = {}): TypeDefinition => {
    const definition: TypeDefinition = {
        type: ClassDefinitionType.CLASS,
        name,
        fullname: name,
        genericName: name,
        ...options
    };
    return newProxyInstance<TypeDefinition>(definition, (object: TypeDefinition, property: PropertyKey, receiver: any) => {
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

        if (property === "needCodegen" || property === "needImport") {
            if (element == null) {
                return true;
            }
        }

        return element;
    }, (object, property, value, receiver) => {
        object[property] = value;
        return true;
    }, ProxyScope.PROPERTY);
}