import {MethodNameCommandResolver, toLineResolver} from "fengwuxp-declarative-command";
import {RouteUriVariable} from "./AppCommandRouter";
import {RouterCommand} from "./RouterCommand";

/**
 *  尝试对 xxxByxx 或 xx_by_xx的方法名称做处理
 *  格式支持:
 *    goodsDetailById ==> goods_detail/{id}
 *    goods_by_id ==> goods_detail/{id}
 *
 * @param name
 * @param resolver
 * @param splitUriVariableNamesFunction
 */
export const tryConverterPathnameVariableResolver = (name: string,
                                                     resolver: MethodNameCommandResolver = toLineResolver,
                                                     splitUriVariableNamesFunction: (str: string) => string[] = (str: string) => resolver(str).split("_")) => {

    if (/[A-Za-z]+By[A-Za-z]+/.test(name)) {
        const [pathname, uriVariableNames] = name.split("By");

        const pathArgumentVariableNames = splitUriVariableNamesFunction(uriVariableNames).map((item) => {
            return `{${item}}`
        }).join("/");

        return `${resolver(pathname)}/${pathArgumentVariableNames}`;
    }
    if (/[A-Za-z]+\_by\_[A-Za-z]+/.test(name)) {
        const [pathname, uriVariableName] = name.split("_by_");
        return `${resolver(pathname)}/{${uriVariableName.toLocaleLowerCase()}}`;
    } else {
        return name;
    }
};


/**
 * 替换路径参数
 * @param uriVariables
 * @param isPrimitiveType
 */
export const replaceUriVariableValue = (uriVariables: RouteUriVariable, isPrimitiveType) => {
    return (substring: string, ...args) => {
        if (isPrimitiveType) {
            //原始类型
            return uriVariables;
        }

        const uriVariablesIsArray = Array.isArray(uriVariables);
        const prop: any = uriVariablesIsArray ? 0 : args[0];
        if (prop == null) {
            throw new Error(`replacer string error, args=${args}`);
        }
        const data = uriVariables[prop];
        if (uriVariablesIsArray) {
            // deleted dataSource prop
            (uriVariables as Array<any>).splice(prop as number, 1);
        } else {
            delete uriVariables[prop];
        }
        return data;
    };
};
