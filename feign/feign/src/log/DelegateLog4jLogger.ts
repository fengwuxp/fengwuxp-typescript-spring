import {AbstractLog4jLogger} from "./AbstractLog4jLogger";
import {Log4jLogger} from "./Log4jLogger";


export default class DelegateLog4jLogger extends AbstractLog4jLogger {

    private readonly delegate: Log4jLogger;

    constructor(delegate: Log4jLogger, category?: string) {
        super(category);
        this.delegate = delegate;
    }

    isLevelEnabled(level: string): boolean {
        return this.delegate.isLevelEnabled(level);
    }

    log(...args: any[]): void {
        const [level, format, ...objects] = args;
        this.delegate.log(level, this.category, format, ...objects)
    }

}