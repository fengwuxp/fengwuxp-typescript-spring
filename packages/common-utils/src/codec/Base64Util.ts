/**
 * 编解码使用的key
 * @type {string}
 * @private
 */
import StringUtils from "../string/StringUtils";


const _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * base64编码工具
 * 编码规则
 * Base64编码的思想是是采用64个基本的ASCII码字符对数据进行重新编码。
 * 它将需要编码的数据拆分成字节数组。以3个字节为一组。
 * 按顺序排列24 位数据，再把这24位数据分成4组，即每组6位。
 * 再在每组的的最高位前补两个0凑足一个字节。这样就把一个3字节为一组的数据重新编码成了4个字节。
 * 当所要编码的数据的字节数不是3的整倍数，也就是说在分组时最后一组不够3个字节。
 * 这时在最后一组填充1到2个0字节。并在最后编码完成后在结尾添加1到2个 “=”。
 */
export default class Base64Util {

    /**
     * 编码
     * @param {string} input
     * @return {string}
     */
    public static encode = function (input: string): string {
        if (!StringUtils.hasText(input)) {
            return "";
        }
        let output: string = "";
        let chr1: number,
            chr2: number,
            chr3: number,
            enc1: number,
            enc2: number,
            enc3: number,
            enc4: number;
        let i = 0;
        input = Utf8Util.encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    /**
     * 解码
     * @param {string} input
     * @return {string}
     */
    public static decode = (input: string): string => {
        if (!StringUtils.hasText(input)) {
            return "";
        }
        let output: string = "";
        let chr1: number, chr2: number, chr3: number;
        let enc1: number, enc2: number, enc3: number, enc4: number;
        let i: number = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Utf8Util.encode(output);
        return output;
    }
}

class Utf8Util {
    /**
     * 编码
     * @param {string} source
     * @return {string}
     */
    public static encode = (source: string): string => {
        source = source.replace(/\r\n/g, "\n");
        let utfText: string = "";
        for (let n = 0; n < source.length; n++) {
            let c = source.charCodeAt(n);
            if (c < 128) {
                utfText += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utfText += String.fromCharCode((c >> 6) | 192);
                utfText += String.fromCharCode((c & 63) | 128);
            } else {
                utfText += String.fromCharCode((c >> 12) | 224);
                utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                utfText += String.fromCharCode((c & 63) | 128);
            }

        }
        return utfText;
    };

    /**
     * 解码
     * @param {string} utfText
     * @return {string}
     */
    public static decode = (utfText: string): string => {
        let result = "";
        let i = 0;
        let c, c2, c3;
        while (i < utfText.length) {
            c = utfText.charCodeAt(i);
            if (c < 128) {
                result += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utfText.charCodeAt(i + 1);
                result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utfText.charCodeAt(i + 1);
                c3 = utfText.charCodeAt(i + 2);
                result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return result;
    }
}
