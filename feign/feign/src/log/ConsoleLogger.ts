import {AbstractLog4jLogger} from "./AbstractLog4jLogger";
import Log4jLevel from "./Log4jLevel";


export default class ConsoleLogger extends AbstractLog4jLogger {

    constructor(category?: string, level?: Log4jLevel) {
        super(category, level);
    }

    log(...args: any[]): void {
        const [level, category, format, ...objects] = args;
        if (!this.isLevelEnabled(level)) {
            return
        }
        const logFn = console[level] ?? console.log;
        logFn(`[${category || this.category}] ${format}`, ...objects);
    }
}