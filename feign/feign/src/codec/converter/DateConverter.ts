import DateFormatUtils, {DateFormatType} from "fengwuxp-common-utils/lib/date/DateFormatUtils";


// date Converter
export type DateConverter = (date: Date) => number | string;

export const timeStampDateConverter: DateConverter = (date: Date) => date.getTime();

export const stringDateConverter = (fmt?: DateFormatType): DateConverter => (date: Date) => DateFormatUtils.formatterDate(date, fmt);
