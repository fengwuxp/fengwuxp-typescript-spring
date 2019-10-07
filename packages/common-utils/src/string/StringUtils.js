"use strict";
exports.__esModule = true;
/**
 * 字符串工具类
 */
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    /**
     * 是否存在内容
     * @param {string} str
     * @return {boolean}
     */
    StringUtils.hasText = function (str) {
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
    StringUtils.trim = function (val) {
        if (val == null) {
            return "";
        }
        return val.toString().trim();
    };
    /**
     * 是否为json字符串的格式
     * @param str
     */
    StringUtils.isJSONString = function (str) {
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
            .map(function (s) { return StringUtils.isJSONString(s); })
            .reduce(function (prev, curr) { return !!curr; });
    };
    return StringUtils;
}());
exports["default"] = StringUtils;
