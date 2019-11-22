import { MethodNameCommandResolver } from "fengwuxp-declarative-command";
import { RouteUriVariable } from "./AppCommandRouter";
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
export declare const tryConverterPathnameVariableResolver: (name: string, resolver?: MethodNameCommandResolver, splitUriVariableNamesFunction?: (str: string) => string[]) => string;
/**
 * 替换路径参数
 * @param uriVariables
 * @param isPrimitiveType
 */
export declare const replaceUriVariableValue: (uriVariables: RouteUriVariable, isPrimitiveType: any) => (substring: string, ...args: any[]) => any;
