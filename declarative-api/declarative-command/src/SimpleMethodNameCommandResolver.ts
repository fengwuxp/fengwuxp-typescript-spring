import {MethodNameCommandResolver} from "./MethodNameCommandResolver";


export const noneResolver: MethodNameCommandResolver = (methodName) => methodName;

/**
 * 下划线转驼峰
 * @param methodName
 */
export const toHumpResolver: MethodNameCommandResolver = (methodName: string) => methodName.replace(/\\_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
});

/**
 * 驼峰转下划线
 * @param methodName
 */
export const toLineResolver: MethodNameCommandResolver = (methodName: string) => {
    return methodName.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * 转大写
 * @param methodName
 */
export const toUpperCaseResolver: MethodNameCommandResolver = (methodName: string) => {

    return methodName.toUpperCase();
};

/**
 * 转小写
 * @param methodName
 */
export const toLocaleUpperCaseResolver: MethodNameCommandResolver = (methodName: string) => {

    return methodName.toLocaleUpperCase();
};

/**
 * 将第一个大写字母转换成 "/" 其他的保存不变
 * example : 'memberIndexView' ==>  member/IndexView'
 * @param methodName
 */
export const firstUpperCaseToLeftIncline = (methodName: string) => {

    return methodName.replace(/([A-Z])/, "/$1");
};

/**
 * 首字母转为小写
 * @param str
 */
export const initialLowercase = (str: string) => {
    return str.replace(str[0], str[0].toLocaleLowerCase());
};

/**
 * 首字母转为大写
 * @param str
 */
export const initialUpperCase = (str: string) => {
    return str.replace(str[0], str[0].toUpperCase());
};

/**
 * 重复第一个单词，加上"/" 并且将第-个单词的第一个字母大写
 * example : 'memberIndexView' ==>  member/MemberIndexView'
 * @param methodName
 */
export const repeatTheFirstWord = (methodName: string) => {

    const strings = methodName.split(/([A-Z])/);
    return `${strings[0]}/${initialUpperCase(strings[0])}${strings.splice(1, strings.length).join("")}`
};


/**
 * 从右向左合并处理
 * @param resolvers
 */
export const reduceRightCommandResolvers = (...resolvers: MethodNameCommandResolver[]): MethodNameCommandResolver => {

    return (methodName: string) => {
        return resolvers.reduceRight((prev, resolver) => {
            return resolver(prev);
        }, methodName);
    }
};


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
export const tryConverterMethodNameCommandResolver = (name: string,
                                                      commonValues: Array<string>,
                                                      defaultCommand: string): string[] => {

    // 找到匹配度最高的指令，如果没有 则使用默认指令
    const [index] = commonValues.map((val, index) => {
        return name.startsWith(val) ? [index, val.length] : [index, -1]
    }).reduce((pre, item) => {
        return pre[1] >= item[1] ? pre : item
    });
    const command = index >= 0 ? commonValues[index] : defaultCommand;

    return [command, name.replace(command, "")];
};
