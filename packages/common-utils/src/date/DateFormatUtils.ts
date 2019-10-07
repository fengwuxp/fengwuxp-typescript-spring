import StringUtils from "../string/StringUtils";

class DateFormatUtils {

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    formatterDate = (date: Date | number, fmt: string = "yyyy-MM-dd hh:mm:ss") => {

        if (typeof date) {
            date = this.getLocalTime(new Date(date));//new Date(date);
        } else {
            date = this.getLocalTime(date as Date);
        }

        const o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (const k in o)
            if (new RegExp("(" + k as string + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    formatterDateToYYMMDD = (date: Date | number) => {
        return this.formatterDate(date, "yyyy-MM-dd");
    };


    /**
     * 字符串或数字转时间
     * @param source
     */
    parse = (source: string | number) => {
        if (source == null) {
            return null;
        }
        if (typeof source === "number") {
            return new Date(source);
        }
        if (!StringUtils.hasText(source)) {
            return null;
        }

        let date = source.trim();
        const length = date.length;
        if (length === 10) {
            //yyyy-MM-dd
            date = `${date} 00:00:00`;
        } else if (length === 16) {
            //yyyy-MM-dd HH:mm
            date = `${date}:00`;
        }

        if (/\w*T\w*/.test(source)) {
            //TODO 带有时区
            throw new Error("not support");
        } else {
            return new Date(source.replace(/-/g, "/"));
        }

    };

    /**
     * 获取本地时间
     * @param {Date} date 当前时间
     * @param {number} i  目标时区，i为时区值数字，比如北京为东八区则输入8,西5输入-5,现默认东八区北京时间
     * @return {Date}
     */
    getLocalTime = (date: Date, i: number = 8): Date => {

        //得到1970年一月一日到现在的秒数
        let local = date.getTime();

        //本地时间与GMT时间的时间偏移差
        let offset = date.getTimezoneOffset() * 60000;

        //得到现在的格林尼治时间
        let utcTime = local + offset;


        return new Date(utcTime + 3600000 * i);
    }
}


export default new DateFormatUtils();
