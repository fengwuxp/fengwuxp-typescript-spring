const moneyRegExp = /^[0-9]+[\.]?[0-9]{0,2}$/;

export default class CommonUtils {

    private constructor() {
    }

    /**
     * 是否为金额
     * @param value
     * @return {boolean}
     */
    static isMoney = (value: any): boolean => {

        if (value === null) {
            return true;
        }

        if (moneyRegExp.test(value)) {
            //金额输入校验
            return true;
        }

        if (value.trim().length === 0) {
            return true;
        }
        return false;
    };

    /**
     * 对象是否为空或者null
     * @param obj
     * @return {boolean}
     */
    static isNullOrUndefined = (obj: any): boolean => {
        return obj == null;
    };

    /**
     * 是否为一个空对象
     * @param obj
     * @return {boolean}
     */
    static isEmptyObject = (obj: any): boolean => {
        if (obj == null) {
            return true;
        }
        if (typeof obj === "string") {
            let k: string = obj.trim();
            if (k.trim().length === 0) {
                return true;
            }
            if (k === "null" || k === "undefined" || k === "{}" || k === "[]") {
                return true;
            }
        }
        if (typeof obj === "number") {
            return isNaN(obj);
        }
        if (typeof obj === "boolean") {
            return false;
        }

        for (let k in obj) {
            return false
        }

        return true;
    };


}
