import {Log4jLogger} from "./Log4jLogger";
import {LoggerLevel} from "./LoggerLevel";


export default class ConsoleLogger implements Log4jLogger {

    private readonly category: string;

    level: LoggerLevel = LoggerLevel.DEBUG;

    constructor(category?: string) {
        this.category = category ?? "";
    }

    isLevelEnabled(level: string = LoggerLevel.DEBUG): boolean {
        return level == this.level;
    }

    isDebugEnabled(): boolean {
        return this.isLevelEnabled(LoggerLevel.DEBUG);
    }

    isErrorEnabled(): boolean {
        return this.isLevelEnabled(LoggerLevel.ERROR);
    }

    isInfoEnabled(): boolean {
        return this.isLevelEnabled(LoggerLevel.INFO);
    }

    isTraceEnabled(): boolean {
        return this.isLevelEnabled(LoggerLevel.TRACE);
    }

    isWarnEnabled(): boolean {
        return this.isLevelEnabled(LoggerLevel.WARN);
    }

    log(...args: any[]): void {
        const [level, format, ...objects] = args;
        if (!this.isLevelEnabled(level)) {
            return
        }
        console.log(`[${this.category}] ${format}`, ...objects)
    }

    debug(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

    error(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

    fatal(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

    info(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

    trace(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

    warn(message: any, ...args: any[]): void {
        this.log(LoggerLevel.DEBUG, message, args);
    }

}