/**
 * 将秒数转换为时分秒
 * @param seconds
 * @param options
 */
export const secondsToString = (seconds: number, options: {
    hourText?: string,
    minuteText?: string,
    secondText?: string
}) => {

    const {hourText, minuteText, secondText} = options;

    //小时
    let hour = Math.floor(seconds / 3600);

    //分钟
    let minute = Math.floor(seconds % 3600 / 60).toString();

    //秒
    let second = Math.floor(seconds % 60).toString();

    let str = "";
    if (hour >= 1) {
        str = `${hour}${hourText==null?"":hourText}`;
    }
    if (minute.length < 2) {
        minute = "0" + minute;
    }
    if (second.length < 2) {
        second = "0" + second;
    }
    str += `${minute}${minuteText == null ? '' : minuteText}`;
    str += `${second}${secondText == null ? '' : secondText}`;
    return str;
};
