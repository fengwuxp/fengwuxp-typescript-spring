export enum _LoggerLevelName {

    NONE = 'none',

    TRACE = 'trace',

    DEBUG = 'debug',

    INFO = 'info',

    WARN = 'warn',

    ERROR = 'error',
}

enum _LoggerLevelIndex {

    NONE = 1000,

    TRACE = 0,

    DEBUG = 10,

    INFO = 30,

    WARN = 50,

    ERROR = 70,
}

export default class Log4jLevel {

    public static NONE: Log4jLevel = Log4jLevel.of(_LoggerLevelName.NONE, _LoggerLevelIndex.NONE);

    public static TRACE: Log4jLevel = Log4jLevel.of(_LoggerLevelName.TRACE, _LoggerLevelIndex.TRACE);

    public static DEBUG = Log4jLevel.of(_LoggerLevelName.DEBUG, _LoggerLevelIndex.DEBUG);

    public static INFO = Log4jLevel.of(_LoggerLevelName.INFO, _LoggerLevelIndex.INFO);

    public static WARN = Log4jLevel.of(_LoggerLevelName.WARN, _LoggerLevelIndex.WARN);

    public static ERROR = Log4jLevel.of(_LoggerLevelName.ERROR, _LoggerLevelIndex.ERROR);

    public readonly name: string;

    public readonly level: number;

    private constructor(name: string, level: number) {
        this.name = name;
        this.level = level;
    }

    public static getLogLevel = (level: string): number => {
        return _LoggerLevelIndex[level.toUpperCase()] ?? _LoggerLevelIndex.NONE;
    }

    public static of(name: string, level: number) {
        return new Log4jLevel(name, level)
    }
}