import {FeignLog4jFactory} from "./FeignLog4jFactory";
import ConsoleLogger from "./ConsoleLogger";


const checkForLog4js = () => {
    try {
        return require('log4js');
    } catch (e) {
        return null;
    }
};
const log4js = checkForLog4js();
const loggerFn = log4js ? log4js.getLogger : (category?: string) => new ConsoleLogger(category);

const factory: FeignLog4jFactory = {
    getLogger: loggerFn
}

export default factory;