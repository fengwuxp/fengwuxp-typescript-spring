/**
 * 字符串工具类
 */
export default class StringUtils {

    /**
     * 是否存在内容
     * @param {string} str
     * @return {boolean}
     */
    public static hasText = (str: string): boolean => {
        if (str == null) {
            return false;
        }
        if (str.replace(/\s/g, '').length === 0) {
            return false;
        }
        return true;
    };

    /**
     * 字符串去掉2端的空格
     * @param {String} val
     * @return {number}
     */
    public static trim = (val: string): string => {
        if (val == null) {
            return "";
        }
        return val.toString().trim();
    };

    /**
     * 是否为json字符串的格式
     * @param str
     */
    public static isJSONString = (str: string): boolean => {

        if (typeof str !== "string") {
            return false;
        }

        str = str.replace(/\s/g, '')
            .replace(/\n|\r/, '');

        if (/^\{(.*?)\}$/.test(str)) {
            return /"(.*?)":(.*?)/g.test(str);
        }


        if (!/^\[(.*?)\]$/.test(str)) {
            return false;
        }

        return str.replace(/^\[/, '')
            .replace(/\]$/, '')
            .replace(/},{/g, '}\n{')
            .split(/\n/)
            .map((s) => StringUtils.isJSONString(s))
            .reduce((prev, curr) => !!curr);
    };
}
