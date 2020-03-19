import {LoggerFactory} from "./LoggerFactory";
import {Logger} from "./Logger";
import {Log4jConfiguration} from './configuration/Log4jConfiguration';
import EventRecodingLogger from "./EventRecodingLogger";


export default class EventLoggerFactory implements LoggerFactory {

    protected configuration: Log4jConfiguration;


    constructor(configuration?: Log4jConfiguration) {
        this.setConfiguration(configuration)
    }


    setConfiguration = (configuration?: Log4jConfiguration) => {
        this.configuration = configuration
    };

    getLogger = (name: string) => {

        const {getLevelConfig, getLogRecoder, getRootLevel} = this.configuration;
        const levelConfig = getLevelConfig();
        let logLevel = getLevelConfig[name];
        if (logLevel == null) {
            // use default
            logLevel = getRootLevel();
        }
        return new EventRecodingLogger(name, getLogRecoder(), logLevel);

    };


}
