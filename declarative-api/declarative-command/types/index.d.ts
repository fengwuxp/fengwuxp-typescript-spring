/**
 * method to command resolver
 */
declare type MethodNameCommandResolver = (method: string) => string;

/**
 * 下划线转驼峰
 * @param methodName
 */
declare const toHumpResolver: MethodNameCommandResolver;
/**
 * 驼峰转下划线
 * @param methodName
 */
declare const toLineResolver: MethodNameCommandResolver;
/**
 * 转大写
 * @param methodName
 */
declare const toUpperCaseResolver: MethodNameCommandResolver;
/**
 * 转小写
 * @param methodName
 */
declare const toLocaleUpperCaseResolver: MethodNameCommandResolver;
/**
 * 从右向左合并处理
 * @param resolvers
 */
declare const reduceRightCommandResolvers: (...resolvers: MethodNameCommandResolver[]) => MethodNameCommandResolver;
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
declare const tryConverterMethodNameCommandResolver: (name: string, commonValues: string[], defaultCommand: string) => string[];

export { MethodNameCommandResolver, reduceRightCommandResolvers, toHumpResolver, toLineResolver, toLocaleUpperCaseResolver, toUpperCaseResolver, tryConverterMethodNameCommandResolver };
