import { DateFormatType } from "fengwuxp-common-utils/lib/date/DateFormatUtils";
export declare type DateConverter = (date: Date) => number | string;
export declare const timeStampDateConverter: DateConverter;
export declare const stringDateConverter: (fmt?: DateFormatType) => DateConverter;
