/**
 * 获取url相同的前缀
 * @param urlList
 */
export const getUrlPrefix = (urlList: string[]) => {
    const prefix = findGroupStringPrefix(urlList);
    if (prefix.endsWith("/")) {
        return prefix;
    }
    const items = prefix.split("/");
    items.pop();
    return items.join("/");
}

/**
 * 查找一组字符串相同的前缀
 *
 * @param strings 一组字符串
 * @return 相同的字符串前缀
 */
export const findGroupStringPrefix = (strings: string[]) => {

    const minLengthString = strings.reduce((previousValue, currentValue) => {
        if (previousValue.length > currentValue.length) {
            return currentValue;
        }
        return previousValue;
    });
    const index = findMaxPrefixIndex(strings, minLengthString);
    return minLengthString.substring(0, index)
}

const findMaxPrefixIndex = (strings: string[], minStr: string) => {
    let maxPrefix = minStr.length;
    let groupLength = strings.length;
    let i = 0;
    while (i < maxPrefix) {
        const item = minStr[i];
        for (let j = 0; j < groupLength; j++) {
            if (item !== strings[j][i]) {
                return i;
            }
        }
        i++;
    }
    return i;
}