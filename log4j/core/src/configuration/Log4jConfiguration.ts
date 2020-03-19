import {LogLevel} from "../LogLevel";
import {LogRecoder} from "../LogRecoder";


export interface Log4jConfiguration {

    /**
     *  default log level
     */
    getRootLevel?:()=>LogLevel;

    /**
     * @return 按照loggger名称映射的级别配置，例如 {
     *
     *    feign: LogLevel.DEBUG，
     *     ui: LogLevel.ERROR，
     *
     * }
     */
    getLevelConfig: () => Record<string, LogLevel>;

    /**
     * get log recoder
     */
    getLogRecoder: () => LogRecoder;
}
