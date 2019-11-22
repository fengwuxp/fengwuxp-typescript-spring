import { MethodNameCommandResolver } from "./MethodNameCommandResolver";
export declare const noneResolver: MethodNameCommandResolver;
/**
 * 下划线转驼峰
 * @param methodName
 */
export declare const toHumpResolver: MethodNameCommandResolver;
/**
 * 驼峰转下划线
 * @param methodName
 */
export declare const toLineResolver: MethodNameCommandResolver;
/**
 * 转大写
 * @param methodName
 */
export declare const toUpperCaseResolver: MethodNameCommandResolver;
/**
 * 转小写
 * @param methodName
 */
export declare const toLocaleUpperCaseResolver: MethodNameCommandResolver;
/**
 * 从右向左合并处理
 * @param resolvers
 */
export declare const reduceRightCommandResolvers: (...resolvers: MethodNameCommandResolver[]) => MethodNameCommandResolver;
/**
 * 尝试转换 方法上的前缀指令参数
 * example:
 *   pushIndex ==> [push,index]
 *   pushGoodsDetail ==> [push,goods_detail]
 *   clearUserInfo ==> [clear,user_info]
 * @param name
 * @param commonValues        指令value集合
 * @param defaultCommand      默认指令
 */
export declare const tryConverterMethodNameCommandResolver: (name: string, commonValues: string[], defaultCommand: string) => string[];
