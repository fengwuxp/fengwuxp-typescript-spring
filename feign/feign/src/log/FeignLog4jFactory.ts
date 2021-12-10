import {Log4jLogger} from "./Log4jLogger";


export interface FeignLog4jFactory {

    getLogger: (category?: string) => Log4jLogger;
}