/**
 * 从数组中移除一个元素
 * @param list
 * @param obj
 * @param equalsKey
 */
export function removeToArray<T, K extends keyof T, E extends T = T>(list: Array<T>, obj: E, equalsKey?: K) {

    const index = indexOfToArray(list, obj, equalsKey);

    if (index > -1) {
        list.splice(index, 1);
    }
}


/**
 * 确定某个元素在数组中的位置
 * @param list
 * @param obj
 * @param equalsKey
 */
export function indexOfToArray<T, K extends keyof T, E extends T = T>(list: Array<T>, obj: E, equalsKey?: K) {
    if (obj == null || list == null || list.length == 0) {
        return -1;
    }
    if (!(equalsKey in obj)) {
        return -1;
    }
    return list.findIndex((value) => {
        if (value == null) {
            return false;
        }

        if (equalsKey == null) {
            return value == obj;
        } else {
            return value[equalsKey] == obj[equalsKey];
        }
    })

}
