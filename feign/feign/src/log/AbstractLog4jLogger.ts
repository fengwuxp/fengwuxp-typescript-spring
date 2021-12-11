import {Log4jLogger} from "./Log4jLogger";
import Log4jLevel from "./Log4jLevel";


export abstract class AbstractLog4jLogger implements Log4jLogger {

    protected readonly category: string;

    public level: Log4jLevel = Log4jLevel.DEBUG;

    protected constructor(category?: string, level?: Log4jLevel) {
        this.category = category ?? "";
        this.level = level ?? Log4jLevel.DEBUG;
    }

    isLevelEnabled(level: string): boolean {
        return (Log4jLevel.getLogLevel(level) - this.level.level) >= 0;
    }

    isDebugEnabled(): boolean {
        return this.isLevelEnabled(Log4jLevel.DEBUG.name);
    }

    isErrorEnabled(): boolean {
        return this.isLevelEnabled(Log4jLevel.ERROR.name);
    }

    isInfoEnabled(): boolean {
        return this.isLevelEnabled(Log4jLevel.INFO.name);
    }

    isTraceEnabled(): boolean {
        return this.isLevelEnabled(Log4jLevel.TRACE.name);
    }

    isWarnEnabled(): boolean {
        return this.isLevelEnabled(Log4jLevel.WARN.name);
    }

    abstract log(...args: any[]): void ;

    debug(message: any, ...args: any[]): void {
        this.log(Log4jLevel.DEBUG.name, message, ...args);
    }

    error(message: any, ...args: any[]): void {
        this.log(Log4jLevel.ERROR.name, message, ...args);
    }

    info(message: any, ...args: any[]): void {
        this.log(Log4jLevel.INFO.name, message, ...args);
    }

    trace(message: any, ...args: any[]): void {
        this.log(Log4jLevel.TRACE.name, message, ...args);
    }

    warn(message: any, ...args: any[]): void {
        this.log(Log4jLevel.WARN.name, message, ...args);
    }

}