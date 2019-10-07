/**
 * 首字母转换为小写
 * @param str
 */
export const transformInitialLetterLowercase = (str: string) => {
    if (str == null) {
        return null;
    }
    const charts = str.split("");

    // const s = charts[0].charCodeAt(0) ^ 32;
    // charts[0] = String.fromCharCode(s);
    charts[0] = charts[0].toLocaleLowerCase();
    return charts.join("");
};