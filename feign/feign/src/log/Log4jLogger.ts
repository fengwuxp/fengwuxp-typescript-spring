import Log4jLevel from "./Log4jLevel";

export interface Log4jLogger {

    level: Log4jLevel;

    log(...args: any[]): void;

    isLevelEnabled(level?: string): boolean;

    isTraceEnabled(): boolean;

    isDebugEnabled(): boolean;

    isInfoEnabled(): boolean;

    isWarnEnabled(): boolean;

    isErrorEnabled(): boolean;

    trace(message: any, ...args: any[]): void;

    debug(message: any, ...args: any[]): void;

    info(message: any, ...args: any[]): void;

    warn(message: any, ...args: any[]): void;

    error(message: any, ...args: any[]): void;
}