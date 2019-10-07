
import * as log4js from "log4js";
import StringUtils from "../../src/string/StringUtils";
import {dateDiffToDays} from "../../src/date/TimeCalculationUtil";
import DateFormatUtils from "../../src/date/DateFormatUtils";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test string utils", () => {



    test("test string utils isJsonString",  async () => {
        const result = StringUtils.isJSONString("1876917131");
        logger.debug(result);

    }, 10 * 1000);


    test("test date",()=>{

        const number = dateDiffToDays(new Date(),new Date());
        logger.debug(number);

        const n2 = dateDiffToDays(new Date(),DateFormatUtils.parse("2020-08-08 22:43:11"));
        logger.debug(n2);
    })
});