/**
 * 字符串工具类
 */
export default class StringUtils {
    /**
     * 是否存在内容
     * @param {string} str
     * @return {boolean}
     */
    static hasText: (str: string) => boolean;
    /**
     * 字符串去掉2端的空格
     * @param {String} val
     * @return {number}
     */
    static trim: (val: string) => string;
    /**
     * 是否为json字符串的格式
     * @param str
     */
    static isJSONString: (str: string) => boolean;
}
