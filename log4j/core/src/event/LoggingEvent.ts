import {LogLevel} from "../LogLevel";


export interface LoggingEvent {

    level: LogLevel;

    loggerName: string;

    message: string;

    argArray: any[];

    timeStamp: number;

    throwable?: Error;
}
