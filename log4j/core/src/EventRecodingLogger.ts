import {Logger} from "./Logger";
import {LogLevel} from "./LogLevel";
import {LogRecoder} from "./LogRecoder";


export default class EventRecodingLogger implements Logger {


    protected name: string;

    protected logRecoder: LogRecoder;

    protected level: LogLevel;

    constructor(name: string, logRecoder: LogRecoder, level?: LogLevel) {
        this.name = name;
        this.logRecoder = logRecoder;
        this.level = level || LogLevel.DEBUG;
    }

    getLevel = () => this.level;

    setLevel = (level: LogLevel) => this.level = level;


    getName = () => this.name;


    isDebugEnabled = () => this.level === LogLevel.DEBUG;
    isErrorEnabled = () => this.level === LogLevel.ERROR;
    isInfoEnabled = () => this.level === LogLevel.INFO;
    isTraceEnabled = () => this.level === LogLevel.TRACE;
    isWarnEnabled = () => this.level === LogLevel.WARN;

    trace = (format: string, ...args: any[]) => {
        this.recordEvent(LogLevel.TRACE, format, args)
    };

    debug = (format: string, ...args: any[]) => {
        this.recordEvent(LogLevel.DEBUG, format, args)
    };

    info = (format: string, ...args: any[]) => {
        this.recordEvent(LogLevel.INFO, format, args)
    };

    warn = (format: string, ...args: any[]) => {
        this.recordEvent(LogLevel.WARN, format, args)
    };

    error = (format: string, ...args: any[]) => {
        this.recordEvent(LogLevel.ERROR, format, args)
    };
    
    private recordEvent = (logLevel: LogLevel, message: string, args: any[]) => {
        const {logRecoder, name, level} = this;
        if (level < logLevel) {
            return;
        }
        logRecoder.recording({
            level,
            throwable: (args || []).find((item) => {
                return item instanceof Error;
            }),
            message,
            argArray: args,
            timeStamp: new Date().getTime(),
            loggerName: name
        })
    }
}
