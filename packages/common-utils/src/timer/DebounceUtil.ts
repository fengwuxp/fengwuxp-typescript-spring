/**
 * 去抖函数
 * @param idle   间隔时间
 * @param action 执行函数
 */
const debounce = (idle: number, action: Function): Function => {
    let last = null;
    return function (): void {
        const args: IArguments = arguments;
        clearTimeout(last);
        last = setTimeout(() => {
            action.apply(this, args);
        }, idle)
    }
};

/**
 * 节流函数
 * @param action 执行函数
 * @param delay  延迟事件，毫秒
 * @return {() => void}
 */
const throttle = (action: Function, delay: number): Function => {
    let last = null;
    return function (): void {
        const args: IArguments = arguments;
        clearTimeout(last);
        last = setTimeout(() => {
            action.apply(this, args);
        }, delay);
    }
};

export {
    debounce,
    throttle
}