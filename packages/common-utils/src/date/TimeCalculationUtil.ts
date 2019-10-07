import {DAYS_OF_YEAR, MONTHS_OF_YEAR, ONE_DAY_MILLISECONDS} from "./Constant";
import DateFormatUtils from "./DateFormatUtils";


/**
 * 是否为闰年
 * @param year 年份
 */
export const isLeapYear = (year: number) => {

    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
};

/**
 * 获取某个月的天数
 * @param date
 */
export const getDaysOfMonth = (date: Date): number => {
    const month = date.getMonth();
    const days = DAYS_OF_YEAR[month];
    if (month != 1) {
        //不是二月
        return days
    }

    return isLeapYear(date.getFullYear()) ? days + 1 : days;

};


/**
 * 计算距离当天时间days天的时间
 *
 * @param days 距离天数，大于0往后 小于0 往前
 */
export const calculationDaysByNow = (days: number): Date => {

    const date = new Date();
    const time = date.getTime() + days * ONE_DAY_MILLISECONDS;
    date.setTime(time);
    return DateFormatUtils.getLocalTime(date);
};

/**
 * 获取某天的开始时间
 * @param date
 */
export const getDateTimeBegin = (date: Date = new Date()): Date => {

    const result = new Date(date.getTime());
    result.setHours(0);
    result.setSeconds(0);
    result.setMinutes(0);
    result.setMilliseconds(0);

    return result;
};

/**
 * 获取某天的结束时间
 * @param date
 */
export const getDateTimeEnd = (date: Date = new Date()): Date => {

    const result = new Date(date.getTime());
    result.setHours(23);
    result.setSeconds(59);
    result.setMinutes(59);
    result.setMilliseconds(999);

    return result;
};

interface GetDateRangeOptions {

    /**
     * 默认：当前时间
     * 需要获取范围的目标时间
     */
    date?: Date;

    /**
     * 默认：0
     * 范围计数，大于0往后 小于0 往前
     */
    rangeNum?: number;

    /**
     * 默认:false
     * false:获取前闭后闭的数据 例如：[2019-11-01 00:00:00-2019-11-15 23:59:59::999]
     * true:获取前闭后开的数据 例如：[2019-11-01 00:00:00-2019-11-16 00:00:00)
     */
    afterOpening?: boolean
}

const DEFAULT_RANGE_OPTIONS: GetDateRangeOptions = {
    date: new Date(),
    rangeNum: 0,
    afterOpening: false
};

/**
 * 获取某周的时间范围
 * @param options
 * @return 某周的开始时间和结束时间
 */
export const getArbitrarilyWeekDateRange = (options?: GetDateRangeOptions): Date[] => {

    const {date, rangeNum, afterOpening}: GetDateRangeOptions = {
        ...DEFAULT_RANGE_OPTIONS,
        ...(options || {})
    };

    const result = [];


    //相对于当前日期rangeNum个周的日期
    const targetDate = new Date(date.getTime() + (ONE_DAY_MILLISECONDS * 7 * rangeNum));

    //返回date是一周中的某一天
    const week = targetDate.getDay();

    //减去的天数
    const minusDay = week !== 0 ? week - 1 : 6;

    //获得当前周的第一天
    const currentWeekFirstDay = new Date(targetDate.getTime() - (ONE_DAY_MILLISECONDS * minusDay));

    //获得当前周的最后一天
    const currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (ONE_DAY_MILLISECONDS * (afterOpening ? 7 : 6)));

    //添加至数组
    result.push(getDateTimeBegin(currentWeekFirstDay));
    result.push(afterOpening ? getDateTimeBegin(currentWeekLastDay) : getDateTimeEnd(currentWeekLastDay));

    return result
};


/**
 * 获取某月的时间范围
 * @param options
 * @return 某月的开始时间和结束时间
 */
export const getArbitrarilyMonthDateRange = (options?: GetDateRangeOptions): Date[] => {

    const {date, rangeNum, afterOpening}: GetDateRangeOptions = {
        ...DEFAULT_RANGE_OPTIONS,
        ...(options || {})
    };

    const result = [];

    //获取当前年份
    let fullYear = date.getFullYear();

    //获取当前月份
    let month = date.getMonth();


    if (rangeNum > 0) {

        const i = rangeNum + month;
        //要加上的年份
        const addYears = Math.floor(i / MONTHS_OF_YEAR);
        //要加上的月份
        const addMoth = rangeNum % MONTHS_OF_YEAR;
        fullYear += addYears;
        month += addMoth;
    } else {
        const addYears = Math.ceil(rangeNum / MONTHS_OF_YEAR);
        fullYear += addYears;
        month += rangeNum % MONTHS_OF_YEAR;
        if (month < 0) {
            fullYear -= 1;
            month += MONTHS_OF_YEAR;
        }
    }

    const targetTime = new Date(date.getTime());
    targetTime.setFullYear(fullYear);
    targetTime.setMonth(month);


    //一个月的第一天
    const firstDate = new Date(targetTime.getTime());
    firstDate.setDate(1);

    //一个月的最后一天
    const lastDate = new Date(targetTime.getTime());
    if (afterOpening) {
        //设置为下个月的第一天
        const targetMonth = lastDate.getMonth() + 1;
        const targetYear = lastDate.getFullYear();
        lastDate.setMonth(targetMonth % MONTHS_OF_YEAR);
        lastDate.setFullYear(targetYear + Math.floor(targetYear / MONTHS_OF_YEAR));
        lastDate.setDate(1);
    } else {
        //设置为本月的最大天数
        lastDate.setDate(getDaysOfMonth(lastDate))
    }

    result.push(getDateTimeBegin(firstDate));
    result.push(afterOpening ? getDateTimeBegin(lastDate) : getDateTimeEnd(lastDate));

    return result;
};

/**
 * 获取下一年的时间
 * @param time
 */
export const getNextYear = (time: number) => {

    const date = new Date(time);
    date.setFullYear(date.getFullYear() + 1);
    return date;
};

/**
 * 计算2个日期相差的天数
 * @param begin       开始时间
 * @param end         结束时间
 * @param includeToday  是否包含今天
 */
export const dateDiffToDays = (begin: Date, end: Date, includeToday: boolean = false): number => {

    begin = getDateTimeBegin(begin);
    end = getDateTimeEnd(end);

    return Math.floor(Math.abs(end.getTime() - begin.getTime()) / ONE_DAY_MILLISECONDS) + (includeToday ? 1 : 0);
};