/**
 * 数值金额转换 元转分
 */
export function yuanTofen(value: number = 0): string {
    const number = value * 1000 / 10;
    const s: string = parseFloat(number.toString()).toFixed(0); // *1000/10 防止精度损失
    return s;//parseInt(s);
}

/**
 * 数值金额转换 分转元
 */
export function fenToYuan(value: number = 0): string {
    const number = value / 100;
    const s: string = parseFloat(number.toString()).toFixed(2);  //保证2位小数
    return s;//parseFloat(s);
}


/**
 * 格式化金额
 * @param {string | number} value
 * @param {boolean} isFee 单位是否为分
 * @return {string}
 */
export const formatterMoney = (value: string | number, isFee: boolean = true): string => {
    let val: string;
    if (typeof value === "number") {
        val = isFee ? fenToYuan(value) : value.toString();
    } else {
        val = value;
    }
    let rex = /\d{1,3}(?=(\d{3})+$)/g;
    return val.replace(/^(-?)(\d+)((\.\d+)?)$/, function (s, s1, s2, s3) {
        return s1 + s2.replace(rex, '$&,') + s3;
    });
};