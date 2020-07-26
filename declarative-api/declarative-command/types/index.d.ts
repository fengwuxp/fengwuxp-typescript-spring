/**
 * method to command resolver
 */
declare type MethodNameCommandResolver = (method: string) => string;

declare const noneResolver: MethodNameCommandResolver;
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
 * 将第一个大写字母转换成 "/" 其他的保存不变
 * example : 'memberIndexView' ==>  member/IndexView'
 * @param methodName
 */
declare const firstUpperCaseToLeftIncline: MethodNameCommandResolver;
/**
 * 首字母转为小写
 * @param str
 */
declare const initialLowercase: (str: string) => string;
/**
 * 首字母转为大写
 * @param str
 */
declare const initialUpperCase: (str: string) => string;
/**
 * 重复第一个单词，加上"/" 并且将第-个单词的第一个字母大写
 * example : 'memberIndexView' ==>  member/MemberIndexView'
 * @param methodName
 */
declare const repeatTheFirstWord: MethodNameCommandResolver;
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
 * @param name  带指令的名称
 * @param defaultCommand      默认指令
 * @return [command,key]
 */
declare const tryConverterMethodNameCommandResolver: (name: string, defaultCommand: string) => string[];

export { MethodNameCommandResolver, firstUpperCaseToLeftIncline, initialLowercase, initialUpperCase, noneResolver, reduceRightCommandResolvers, repeatTheFirstWord, toHumpResolver, toLineResolver, toLocaleUpperCaseResolver, toUpperCaseResolver, tryConverterMethodNameCommandResolver };
