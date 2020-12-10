import * as log4js from "log4js";
import {findGroupStringPrefix} from "../src/util/ApiUtils";

const logger = log4js.getLogger();
logger.level = 'debug';
describe("test swagger api parser", () => {

    test("findGroupStringPrefix", () => {
        const prefix = findGroupStringPrefix([
            "a123456789",
            "a123&",
            "a1234567",
            "a123456",
        ]);
        logger.debug(prefix)
    })
})