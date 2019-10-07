import UTF8Util from "./UTF8Util";
import StringUtils from "../string/StringUtils";

/**
 * 16 进制前缀
 * @type {string}
 */
const HEX_PREFIX: string = "0x";

/**
 *  字符串转16进制
 */
export default class StringToHexUtil {


    /**
     * 编码
     * @param {string} source
     * @return {string}
     */
    public static encode = (source: string): string => {
        let utf8Bytes = UTF8Util.getUTF8Bytes(source);
        const hexCharCode = [];
        hexCharCode.push(HEX_PREFIX);
        utf8Bytes.forEach((byte) => {
            hexCharCode.push(byte.toString(16));
        });
        return hexCharCode.join("");
    };


    /**
     * 解码
     * @param {string} hexCharCodeStr
     * @return {string}
     */
    public static decode = (hexCharCodeStr: string): string => {
        if (!StringUtils.hasText(hexCharCodeStr)) {
            return "";
        }
        let trimedStr: string = hexCharCodeStr.trim();
        let rawStr: string =
            trimedStr.substr(0, 2).toLowerCase() === HEX_PREFIX ? trimedStr.substr(2) : trimedStr;
        let len: number = rawStr.length;
        if (len % 2 !== 0) {
            console.error("Illegal Format ASCII Code!");
            return "";
        }
        let curCharCode: number;
        let btyes: Array<number> = [];
        for (let i = 0; i < len; i = i + 2) {
            // ASCII Code Value
            curCharCode = parseInt(rawStr.substr(i, 2), 16);
            btyes.push(curCharCode);
        }
        return UTF8Util.UTF8BytesToString(btyes);
    }
}
