import * as log4js from "log4js";
import {replacePathVariableValue} from "../src/helper/ReplaceUriVariableHelper";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test replace path variable value", () => {

    test("test named placeholder", () => {
        let result = replacePathVariableValue("a_{name}", {name:"2"});
        expect(result).toBe("a_2");
    })

    test("test default value placeholder", () => {
        let result = replacePathVariableValue("a_{name:test}", {});
        expect(result).toBe("a_test");
    })
})